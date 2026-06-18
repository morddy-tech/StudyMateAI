export async function extractTextFromPDF(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("PDF parsing only works in the browser.");
  }

  try {
    // ✅ Correct import for pdfjs v6
    const pdfjsLib = await import("pdfjs-dist");

    // ⚠️ IMPORTANT (v6): worker must be imported differently
    // FIX: Cast to 'any' to satisfy TypeScript's default export check
    const pdfWorker = (await import("pdfjs-dist/build/pdf.worker.min.mjs")).default as any;

    // We create a blob URL for the worker
    const workerSrc = URL.createObjectURL(
      new Blob([pdfWorker], { type: "application/javascript" })
    );

    // FIX: Use 'workerSrc' string instead of 'workerPort' to avoid type conflicts
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

    const arrayBuffer = await file.arrayBuffer();

    // FIX: Use 'data' parameter (the red line in your screenshot might have been a type linting issue)
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      disableWorker: false, // keep worker ON for performance
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) => (item?.str ? item.str : ""))
        .join(" ")
        .trim();

      fullText += pageText + "\n\n";

      if (onProgress) {
        onProgress(Math.round((i / pdf.numPages) * 100));
      }
    }

    // FIX: Remove 'await' before 'pdf.destroy()' (it's synchronous in v6)
    pdf.destroy();

    if (!fullText.trim()) {
      throw new Error(
        "No selectable text found. This PDF may be scanned or image-based (OCR required)."
      );
    }

    return fullText.trim();
  } catch (error: any) {
    console.error("PDF Extraction Error:", error);
    throw new Error(
      error?.message ||
        "Failed to extract text from PDF. Please try another file."
    );
  }
}
