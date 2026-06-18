import React, { useState } from "react";
import { SummaryResult } from "@/types";
import { Copy, Check, FileText } from "lucide-react";

interface SummaryViewProps {
  data: SummaryResult;
}

export default function SummaryView({ data }: SummaryViewProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b border-border pb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Generated Summaries</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Short Summary */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm relative group transition-all duration-200 hover:border-primary/30">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
              Short Summary
            </span>
            <button
              onClick={() => copyToClipboard(data.short, "short")}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Copy Summary"
            >
              {copiedSection === "short" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-foreground leading-relaxed text-sm">{data.short}</p>
        </div>

        {/* Medium Summary */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm relative group transition-all duration-200 hover:border-primary/30">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
              Medium Summary
            </span>
            <button
              onClick={() => copyToClipboard(data.medium, "medium")}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Copy Summary"
            >
              {copiedSection === "medium" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-foreground leading-relaxed text-sm whitespace-pre-line">{data.medium}</p>
        </div>

        {/* Detailed Summary */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm relative group transition-all duration-200 hover:border-primary/30">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
              Detailed Summary
            </span>
            <button
              onClick={() => copyToClipboard(data.detailed, "detailed")}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Copy Summary"
            >
              {copiedSection === "detailed" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-foreground leading-relaxed text-sm whitespace-pre-line">{data.detailed}</p>
        </div>
      </div>
    </div>
  );
}
