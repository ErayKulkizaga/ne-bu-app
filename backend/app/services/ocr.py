"""
OCR service — placeholder for future implementation.

TODO: Integrate Google Cloud Vision API or Tesseract to extract ingredient
text from uploaded product label photos.

Planned interface:
  - accept image bytes or file path
  - return raw extracted text string
  - pass result to parser.parse_ingredients()
"""
from fastapi import HTTPException, status


def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Placeholder: OCR text extraction from a product label image.

    Raises HTTP 501 Not Implemented until a real OCR backend is integrated.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail=(
            "OCR functionality is not yet available. "
            "This feature is planned for a future release."
        ),
    )
