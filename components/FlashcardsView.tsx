import React, { useState, useEffect } from "react";
import { FlashcardResult } from "@/types";
import { ChevronLeft, ChevronRight, RotateCcw, HelpCircle, BookOpen, AlertCircle } from "lucide-react";

interface FlashcardsViewProps {
  data: FlashcardResult[];
}

export default function FlashcardsView({ data }: FlashcardsViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Handle keyboard arrow keys to navigate and space to flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, data.length]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    }, 150);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
  };

  if (data.length === 0) {
    return (
      <div className="p-8 text-center bg-card border border-border rounded-2xl flex flex-col items-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No flashcards found. Try another generation.</p>
      </div>
    );
  }

  const currentCard = data[currentIndex];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Interactive Flashcards</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
          <span>Tip: Use </span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">Space</kbd>
          <span> to flip, </span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">←</kbd>
          <span> / </span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">→</kbd>
          <span> to navigate.</span>
        </div>
      </div>

      {/* Card Container */}
      <div className="perspective-1000 w-full aspect-[1.6/1]">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-full transform-style-3d transition-transform duration-500 cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Card Front */}
          <div className="absolute inset-0 bg-card border-2 border-border hover:border-primary/40 rounded-3xl p-8 flex flex-col justify-between shadow-md backface-hidden select-none">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
              <span className="uppercase tracking-widest text-primary">Front Side</span>
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-grow flex items-center justify-center text-center px-4 py-8">
              <p className="text-lg sm:text-xl font-semibold leading-relaxed text-foreground">
                {currentCard.front}
              </p>
            </div>
            <div className="text-center text-xs text-muted-foreground font-medium animate-pulse">
              Click or press Space to reveal answer
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 bg-primary/5 border-2 border-primary/30 rounded-3xl p-8 flex flex-col justify-between shadow-md backface-hidden rotate-y-180 select-none">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
              <span className="uppercase tracking-widest text-primary">Back Side</span>
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-grow flex items-center justify-center text-center px-4 py-8 overflow-y-auto">
              <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed max-h-full">
                {currentCard.back}
              </p>
            </div>
            <div className="text-center text-xs text-muted-foreground font-medium">
              Click or press Space to view front
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center space-x-1 text-sm font-semibold"
          title="Reset Deck"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset Deck</span>
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl border border-border hover:bg-muted hover:text-foreground transition-all cursor-pointer"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-foreground">
            {currentIndex + 1} <span className="text-muted-foreground">/</span> {data.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl border border-border hover:bg-muted hover:text-foreground transition-all cursor-pointer"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
