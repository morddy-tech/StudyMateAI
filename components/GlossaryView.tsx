import React, { useState } from "react";
import { DefinitionResult } from "@/types";
import { Copy, Check, Bookmark } from "lucide-react";

interface GlossaryViewProps {
  data: DefinitionResult[];
}

export default function GlossaryView({ data }: GlossaryViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = data.map((item) => `${item.term}: ${item.definition}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Glossary & Definitions</h3>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1 text-xs font-semibold cursor-pointer border border-border bg-card"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span>Copied All</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
        <table className="w-full text-left border-collapse bg-card">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="p-4 text-sm font-bold text-foreground w-1/3">Term</th>
              <th className="p-4 text-sm font-bold text-foreground">Definition</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-border/60 hover:bg-muted/20 last:border-b-0 transition-colors"
              >
                <td className="p-4 text-sm font-bold text-primary align-top">
                  {item.term}
                </td>
                <td className="p-4 text-sm text-foreground align-top leading-relaxed whitespace-pre-line">
                  {item.definition}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
