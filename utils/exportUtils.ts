import { StudyKitResult } from "@/types";

export function formatResultToMarkdown(results: StudyKitResult): string {
  let md = "# StudyMate AI - Generated Study Materials\n\n";

  if (results.summary) {
    md += "## Summaries\n\n";
    md += `### Short Summary\n${results.summary.short}\n\n`;
    md += `### Medium Summary\n${results.summary.medium}\n\n`;
    md += `### Detailed Summary\n${results.summary.detailed}\n\n`;
    md += "---\n\n";
  }

  if (results.explainSimply) {
    md += "## Explained Simply\n\n";
    md += `${results.explainSimply}\n\n`;
    md += "---\n\n";
  }

  if (results.keyPoints) {
    md += "## Key Points\n\n";
    results.keyPoints.forEach((kp) => {
      md += `* ${kp.point}\n`;
    });
    md += "\n---\n\n";
  }

  if (results.definitions) {
    md += "## Glossary & Definitions\n\n";
    md += "| Term | Definition |\n| --- | --- |\n";
    results.definitions.forEach((def) => {
      md += `| ${def.term} | ${def.definition} |\n`;
    });
    md += "\n---\n\n";
  }

  if (results.flashcards) {
    md += "## Flashcards\n\n";
    results.flashcards.forEach((card, index) => {
      md += `### Card ${index + 1}\n**Front:** ${card.front}\n**Back:** ${card.back}\n\n`;
    });
    md += "---\n\n";
  }

  if (results.quiz) {
    md += "## Practice Quiz\n\n";
    results.quiz.forEach((q, index) => {
      md += `### Question ${index + 1} (${q.type})\n${q.question}\n\n`;
      if (q.options) {
        q.options.forEach((opt) => {
          md += `- [ ] ${opt}\n`;
        });
        md += "\n";
      }
      md += `**Correct Answer:** ${q.correctAnswer}\n\n`;
    });
    md += "---\n\n";
  }

  if (results.studyGuide) {
    const sg = results.studyGuide;
    md += "## Study Guide\n\n";
    md += `### Overview\n${sg.overview}\n\n`;
    
    if (sg.mainConcepts) {
      md += "### Main Concepts\n\n";
      sg.mainConcepts.forEach((c) => {
        md += `#### ${c.concept}\n${c.description}\n\n`;
      });
    }

    if (sg.definitions) {
      md += "### Key Vocabulary\n\n";
      sg.definitions.forEach((d) => {
        md += `* **${d.term}**: ${d.definition}\n`;
      });
      md += "\n";
    }

    if (sg.examples) {
      md += "### Real-world Examples\n\n";
      sg.examples.forEach((ex) => {
        md += `> ${ex}\n\n`;
      });
    }

    if (sg.revisionNotes) {
      md += `### Quick Revision Notes\n${sg.revisionNotes}\n\n`;
    }

    if (sg.practiceQuestions) {
      md += "### Practice Exercises\n\n";
      sg.practiceQuestions.forEach((q) => {
        md += `1. ${q}\n`;
      });
      md += "\n";
    }

    if (sg.studyTips) {
      md += "### Key Study Tips\n\n";
      sg.studyTips.forEach((t) => {
        md += `* *${t}*\n`;
      });
      md += "\n";
    }
  }

  return md;
}

export function downloadMarkdownFile(content: string, filename: string = "studymate-kit.md") {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
