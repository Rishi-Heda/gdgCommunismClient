import os
import shutil
import zipfile
from pathlib import Path

# ==========================================
# Workspace Path Definitions
# ==========================================
# This creates a "workspace" folder in the same directory as main.py
WORKSPACE_DIR = Path(os.getcwd()) / "workspace"

INPUTS_DIR = WORKSPACE_DIR / "inputs"
OUTPUTS_DIR = WORKSPACE_DIR / "outputs"
ARCHIVES_DIR = WORKSPACE_DIR / "archives" # Stores the zipped files before upload

def setup_workspace():
    """
    Ensures all necessary directories exist.
    Called when the app boots up.
    """
    INPUTS_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    ARCHIVES_DIR.mkdir(parents=True, exist_ok=True)

def clean_workspace():
    """
    Wipes the inputs and outputs folders completely clean.
    MUST be called before a new task starts to prevent data contamination.
    """
    setup_workspace()

    for directory in [INPUTS_DIR, OUTPUTS_DIR]:
        for item in directory.iterdir():
            try:
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()
            except Exception as e:
                print(f"Warning: Failed to delete {item}: {e}")

def extract_inputs(zip_file_path: Path) -> bool:
    """
    Takes a downloaded dataset/code zip file and extracts it into the INPUTS_DIR.
    """
    print(f"Extracting {zip_file_path.name} to workspace inputs...")
    try:
        if not zip_file_path.exists():
            print(f"Failed to extract inputs: {zip_file_path} does not exist.")
            return False

        if not zipfile.is_zipfile(zip_file_path):
            print(f"Failed to extract inputs: {zip_file_path} is not a zip file.")
            return False

        shutil.unpack_archive(filename=zip_file_path, extract_dir=INPUTS_DIR)
        return True
    except Exception as e:
        print(f"Failed to extract inputs: {e}")
        return False

def compress_outputs(task_id: str) -> Path:
    """
    Takes everything the Docker container wrote to OUTPUTS_DIR and zips it up.
    Returns the path to the newly created .zip file so the network client can upload it.
    """
    setup_workspace()
    print(f"Compressing outputs for task {task_id}...")

    archive_base_path = ARCHIVES_DIR / f"results_{task_id}"

    try:
        zipped_path_string = shutil.make_archive(
            base_name=str(archive_base_path),
            format="zip",
            root_dir=OUTPUTS_DIR
        )
        return Path(zipped_path_string)
    except Exception as e:
        print(f"Failed to compress outputs: {e}")
        raise e
