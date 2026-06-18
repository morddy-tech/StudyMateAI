import React from "react";
import { StudyGuideResult } from "@/types";
import { BookOpen, AlertCircle, Info, Lightbulb, CheckSquare, Compass } from "lucide-react";

interface StudyGuideViewProps {
  data: StudyGuideResult;
}

export default function StudyGuideView({ data }: StudyGuideViewProps) {
  return (
    <div className="space-y-10 max-w-4xl mx-auto text-foreground">
      <div className="flex items-center space-x-2 border-b border-border pb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Structured Study Guide</h3>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h4 className="text-base font-bold text-primary uppercase tracking-widest flex items-center">
          <Compass className="w-4 h-4 mr-2 animate-spin-slow" /> Overview
        </h4>
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {data.overview}
        </div>
      </section>

      {/* Main Concepts */}
      {data.mainConcepts && data.mainConcepts.length > 0 && (
        <section className="space-y-4">
          <h4 className="text-base font-bold text-primary uppercase tracking-widest flex items-center">
            <Info className="w-4 h-4 mr-2" /> Main Concepts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.mainConcepts.map((item, index) => (
              <div key={index} className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
                <h5 className="font-bold text-foreground mb-2 text-sm sm:text-base">{item.concept}</h5>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Definitions */}
      {data.definitions && data.definitions.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-base font-bold text-primary uppercase tracking-widest flex items-center">
            <BookOpen className="w-4 h-4 mr-2" /> Key Vocabulary
          </h4>
          <div className="bg-card border border-border rounded-2xl shadow-sm divide-y divide-border/60">
            {data.definitions.map((item, index) => (
              <div key={index} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                <strong className="text-primary sm:w-1/3 flex-shrink-0 font-bold">{item.term}</strong>
                <span className="text-foreground leading-relaxed flex-grow whitespace-pre-line">{item.definition}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Examples */}
      {data.examples && data.examples.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-base font-bold text-primary uppercase tracking-widest flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" /> Real-World Examples
          </h4>
          <div className="space-y-3">
            {data.examples.map((ex, index) => (
              <div key={index} className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-2xl text-sm leading-relaxed">
                {ex}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Revision Notes */}
      {data.revisionNotes && (
        <section className="space-y-3">
          <h4 className="text-base font-bold text-primary uppercase tracking-widest flex items-center">
            <BookOpen className="w-4 h-4 mr-2" /> Quick Revision Notes
          </h4>
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line">
            {data.revisionNotes}
          </div>
        </section>
      )}

      {/* Practice Questions */}
      {data.practiceQuestions && data.practiceQuestions.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-base font-bold text-primary uppercase tracking-widest flex items-center">
            <CheckSquare className="w-4 h-4 mr-2" /> Practice Exercises
          </h4>
          <ul className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-3 list-disc list-inside text-sm">
            {data.practiceQuestions.map((q, index) => (
              <li key={index} className="leading-relaxed text-foreground">
                {q}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Study Tips */}
      {data.studyTips && data.studyTips.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-base font-bold text-primary uppercase tracking-widest flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" /> Key Study Tips
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.studyTips.map((tip, index) => (
              <div key={index} className="bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl text-xs sm:text-sm text-foreground leading-relaxed flex items-start">
                <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
