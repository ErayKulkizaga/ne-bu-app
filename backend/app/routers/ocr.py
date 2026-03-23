from fastapi import APIRouter, File, UploadFile, HTTPException, status

router = APIRouter()


@router.post("/upload")
async def upload_label_image(file: UploadFile = File(...)) -> dict:
    """
    Placeholder endpoint for OCR-based ingredient extraction.

    TODO: Integrate Google Cloud Vision or Tesseract.
    Currently returns HTTP 501 Not Implemented.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="OCR functionality is not yet available. This feature is planned for a future release.",
    )
