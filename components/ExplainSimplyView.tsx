import React, { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

interface ExplainSimplyViewProps {
  data: string;
}

export default function ExplainSimplyView({ data }: ExplainSimplyViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b border-border pb-4">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        <h3 className="text-xl font-bold">Explained Simply</h3>
      </div>

      <div className="bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-sm relative group hover:border-primary/30 transition-all duration-200">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 px-3 py-1 rounded-full bg-indigo-500/10">
            Feynman Method (Teenager Friendly)
          </span>
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Copy Explanation"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="prose dark:prose-invert max-w-none text-foreground leading-relaxed text-base space-y-4">
          {data.split("\n\n").map((para, i) => (
            <p key={i} className="whitespace-pre-line">{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
