export async function extractTextFromPDF(file: File, onProgress?: (percent: number) => void): Promise<string> {
  if (typeof window === "undefined") return "";

  try {
    const pdfjsLib = await import("pdfjs-dist");
    
    // Set worker path using standard cdnjs matching the package version
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    let fullText = "";

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(" ");
      fullText += pageText + "\n";
      
      if (onProgress) {
        onProgress(Math.round((i / numPages) * 100));
      }
    }

    return fullText;
  } catch (error: any) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Could not extract text from the PDF file. Please ensure it is not password-protected or corrupted.");
  }
}

export async function extractTextFromTXT(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve((e.target?.result as string) || "");
    };
    reader.onerror = () => {
      reject(new Error("Failed to read the TXT file."));
    };
    reader.readAsText(file);
  });
}
