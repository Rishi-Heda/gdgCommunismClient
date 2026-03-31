import asyncio

from src.network.client import send_heartbeat


async def start_heartbeat_loop():
    """Sends periodic heartbeat to server so node stays schedulable."""
    print("Network heartbeat loop started.")
    await asyncio.sleep(3)
    while True:
        try:
            await send_heartbeat()
        except Exception:
            pass
        await asyncio.sleep(10)
