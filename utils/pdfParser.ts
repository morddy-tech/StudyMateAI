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

    // ✅ Load worker from the public folder (Vercel fix)
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const arrayBuffer = await file.arrayBuffer();

    // ✅ FIX: Removed 'disableWorker: false'. 
    // The worker is already enabled via GlobalWorkerOptions!
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
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

    // ✅ FIX: Remove 'await' before destroy (synchronous in v6)
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

// ✅ TXT extractor to match Workspace.tsx import
export async function extractTextFromTXT(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => reject(new Error("Failed to read text file"));
    reader.readAsText(file);
  });
}
