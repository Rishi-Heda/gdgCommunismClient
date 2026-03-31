import json
from pathlib import Path
from typing import Any

import yaml

MANIFEST_NAMES = ("manifest.yaml", "manifest.yml", "manifest.json")


def load_task_manifest(inputs_dir: Path) -> dict[str, Any]:
    for name in MANIFEST_NAMES:
        manifest_path = inputs_dir / name
        if not manifest_path.exists():
            continue

        if manifest_path.suffix.lower() == ".json":
            return json.loads(manifest_path.read_text(encoding="utf-8"))

        return yaml.safe_load(manifest_path.read_text(encoding="utf-8")) or {}

    return {}


def resolve_execution_steps(inputs_dir: Path, manifest: dict[str, Any]) -> list[dict[str, Any]]:
    flow = manifest.get("flow") or {}
    raw_steps = flow.get("steps") or []

    steps: list[dict[str, Any]] = []
    for index, step in enumerate(raw_steps, start=1):
        script = step.get("script") or step.get("entrypoint")
        if not script:
            continue

        script_path = inputs_dir / script
        if not script_path.exists():
            raise FileNotFoundError(f"Manifest step script not found: {script_path}")

        steps.append(
            {
                "name": step.get("name") or script_path.name,
                "script_path": script_path,
                "context_files": step.get("context_files") or [],
                "extra": step.get("extra") or {},
            }
        )

    if steps:
        return steps

    entrypoint = manifest.get("entrypoint") or flow.get("entrypoint")
    if entrypoint:
        script_path = inputs_dir / entrypoint
        if not script_path.exists():
            raise FileNotFoundError(f"Manifest entrypoint not found: {script_path}")
        return [{"name": script_path.name, "script_path": script_path, "context_files": [], "extra": {}}]

    python_files = sorted(
        path for path in inputs_dir.rglob("*.py")
        if path.name not in MANIFEST_NAMES
    )
    if not python_files:
        return []

    return [{"name": python_files[0].name, "script_path": python_files[0], "context_files": [], "extra": {}}]


def load_context_bundle(inputs_dir: Path, manifest: dict[str, Any], steps: list[dict[str, Any]]) -> dict[str, Any]:
    context: dict[str, Any] = {}

    manifest_context_files = manifest.get("context_files") or []
    for rel_path in manifest_context_files:
        _load_json_into_context(inputs_dir, rel_path, context)

    if not manifest_context_files:
        for json_path in sorted(inputs_dir.rglob("*.json")):
            if json_path.name == "manifest.json":
                continue
            rel_path = json_path.relative_to(inputs_dir).as_posix()
            _load_json_into_context(inputs_dir, rel_path, context)

    for step in steps:
        for rel_path in step.get("context_files") or []:
            _load_json_into_context(inputs_dir, rel_path, context)

    return context


def build_checkpoint_plan(manifest: dict[str, Any]) -> dict[str, int]:
    checkpoint_cfg = manifest.get("checkpoints") or {}
    compute_cfg = manifest.get("compute") or {}

    count = int(checkpoint_cfg.get("count", 0) or 0)
    interval_seconds = int(checkpoint_cfg.get("interval_seconds", 0) or 0)
    required_seconds = int(
        compute_cfg.get("required_seconds")
        or compute_cfg.get("estimated_runtime_seconds")
        or 0
    )

    if interval_seconds <= 0 and required_seconds > 0:
        if count <= 0:
            count = min(10, max(1, required_seconds // 60))
        interval_seconds = max(10, required_seconds // max(count, 1))

    return {
        "count": max(count, 0),
        "interval_seconds": max(interval_seconds, 0),
        "required_seconds": max(required_seconds, 0),
    }


def _load_json_into_context(inputs_dir: Path, rel_path: str, context: dict[str, Any]) -> None:
    json_path = inputs_dir / rel_path
    if not json_path.exists():
        raise FileNotFoundError(f"Context file not found: {json_path}")
    context[Path(rel_path).as_posix()] = json.loads(json_path.read_text(encoding="utf-8"))
