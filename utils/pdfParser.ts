export async function extractTextFromPDF(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("PDF parsing only works in the browser.");
  }

  try {
    const pdfjsLib = await import("pdfjs-dist");

    // ✅ Load worker from the public folder
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const arrayBuffer = await file.arrayBuffer();

    // ✅ Removed 'disableWorker: false' to fix the previous type error
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

    // ✅ FIX: Use 'cleanup()' instead of 'destroy()' and cast to any to bypass TypeScript
    try {
      (pdf as any).cleanup(); 
    } catch (cleanupError) {
      console.warn("PDF cleanup warning:", cleanupError);
    }

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

// ✅ TXT extractor
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
