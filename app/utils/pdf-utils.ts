import { PDFDocument } from 'pdf-lib';

/**
 * Replaces a specific page in the source PDF with the first page of the replacement PDF.
 * @param sourcePdfBytes The bytes of the source PDF.
 * @param replacementPdfBytes The bytes of the replacement PDF.
 * @param pageNumber The 1-based page number to replace.
 * @returns The bytes of the modified PDF.
 */
export async function replacePage(
    sourcePdfBytes: ArrayBuffer,
    replacementPdfBytes: ArrayBuffer,
    pageNumber: number
): Promise<Uint8Array> {
    // Load both PDFs
    const sourceDoc = await PDFDocument.load(sourcePdfBytes);
    const replacementDoc = await PDFDocument.load(replacementPdfBytes);

    // Validate page number (1-based index)
    const pageCount = sourceDoc.getPageCount();
    if (pageNumber < 1 || pageNumber > pageCount) {
        throw new Error(`Invalid page number. Document has ${pageCount} pages.`);
    }

    // Get the replacement page (assume first page of replacement PDF)
    const [replacementPage] = await sourceDoc.copyPages(replacementDoc, [0]);

    // Replace the page
    // Note: PDFDocument methods use 0-based index
    sourceDoc.removePage(pageNumber - 1);
    sourceDoc.insertPage(pageNumber - 1, replacementPage);

    // Save the modified PDF
    return await sourceDoc.save();
}
