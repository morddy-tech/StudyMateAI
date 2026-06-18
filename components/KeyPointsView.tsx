import React, { useState } from "react";
import { KeyPointResult } from "@/types";
import { Copy, Check, List, Lightbulb, Target, Award, Info, BookOpen, Star, CheckCircle, HelpCircle } from "lucide-react";

interface KeyPointsViewProps {
  data: KeyPointResult[];
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Lightbulb,
  Target,
  Award,
  Info,
  BookOpen,
  Star,
  CheckCircle,
  HelpCircle,
};

export default function KeyPointsView({ data }: KeyPointsViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = data.map((item) => `• ${item.point}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div className="flex items-center space-x-2">
          <List className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Key Points</h3>
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

      <ul className="space-y-4">
        {data.map((item, index) => {
          const IconComponent = iconMap[item.iconName] || Lightbulb;
          return (
            <li
              key={index}
              className="flex items-start space-x-4 p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <IconComponent className="w-5 h-5" />
              </div>
              <p className="text-foreground leading-relaxed text-sm pt-1">{item.point}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
