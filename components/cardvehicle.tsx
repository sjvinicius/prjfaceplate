import cv2
import time
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.core.frame_buffer import FrameBuffer
from app.core.recognition_cache import RecognitionCache

router = APIRouter()

frame_buffer: FrameBuffer = None
cache: RecognitionCache = None


def set_dependencies(buffer: FrameBuffer, recognition_cache: RecognitionCache):
    global frame_buffer, cache
    frame_buffer = buffer
    cache = recognition_cache


def generate_stream():

    while True:

        if frame_buffer is None:
            time.sleep(0.1)
            continue

        frame = frame_buffer.get()

        if frame is None:
            time.sleep(0.01)
            continue

        results = cache.get() if cache else []

        ret, jpeg = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])

        if not ret:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" +
            jpeg.tobytes() +
            b"\r\n"
        )

        time.sleep(0.03)


@router.get("/anpr/stream")
def stream():
    return StreamingResponse(
        generate_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )