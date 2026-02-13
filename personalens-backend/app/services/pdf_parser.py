"""
PDF Parser Service for extracting text from PDF files.
"""
import pdfplumber
from typing import BinaryIO
import logging

logger = logging.getLogger(__name__)


class PDFParserService:
    """
    Service for parsing PDF files and extracting text content.
    Uses pdfplumber for reliable text extraction.
    """
    
    @staticmethod
    def extract_text(file_obj: BinaryIO) -> str:
        """
        Extract text from a PDF file object.
        
        Args:
            file_obj: File-like object containing PDF data
            
        Returns:
            str: Extracted text content
            
        Raises:
            Exception: If PDF parsing fails
        """
        try:
            text_parts = []
            
            with pdfplumber.open(file_obj) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    page_text = page.extract_text()
                    
                    if page_text:
                        text_parts.append(page_text)
                    else:
                        logger.warning(f"No text found on page {page_num}")
            
            if not text_parts:
                logger.warning("No text extracted from PDF")
                return ""
            
            combined_text = "\n".join(text_parts)
            logger.info(f"Successfully extracted {len(combined_text)} characters from PDF")
            
            return combined_text
            
        except Exception as e:
            logger.error(f"Failed to parse PDF: {e}")
            raise Exception(f"PDF parsing error: {str(e)}")


# Backward compatibility function
def extract_text_from_pdf(file_obj: BinaryIO) -> str:
    """
    Legacy function for backward compatibility.
    Delegates to PDFParserService.
    """
    return PDFParserService.extract_text(file_obj)
