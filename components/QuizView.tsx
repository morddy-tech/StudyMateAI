import React, { useState } from "react";
import { QuizQuestionResult } from "@/types";
import { HelpCircle, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";

interface QuizViewProps {
  data: QuizQuestionResult[];
}

export default function QuizView({ data }: QuizViewProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const handleSelectOption = (questionIndex: number, option: string) => {
    if (revealedAnswers[questionIndex] || showAllAnswers) return; // Locked after reveal
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const toggleRevealAnswer = (questionIndex: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [questionIndex]: !prev[questionIndex] }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setRevealedAnswers({});
    setShowAllAnswers(false);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Practice Quiz</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAllAnswers(!showAllAnswers)}
            className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all cursor-pointer flex items-center space-x-1.5"
          >
            {showAllAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showAllAnswers ? "Hide All Answers" : "Reveal All Answers"}</span>
          </button>
          <button
            onClick={handleResetQuiz}
            className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted text-sm font-semibold transition-all cursor-pointer"
          >
            Reset Quiz
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {data.map((q, qIndex) => {
          const isRevealed = revealedAnswers[qIndex] || showAllAnswers;
          const selectedAnswer = selectedAnswers[qIndex];
          const isCorrect = selectedAnswer === q.correctAnswer;

          return (
            <div
              key={qIndex}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                  Question {qIndex + 1}
                </span>
                <span className="text-xs font-semibold text-muted-foreground capitalize">
                  {q.type.replace("-", " ")}
                </span>
              </div>

              <h4 className="text-base font-bold text-foreground mb-6 leading-relaxed">
                {q.question}
              </h4>

              {/* Options for Multiple Choice and True/False */}
              {q.type !== "short-answer" && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {q.options.map((option, oIndex) => {
                    const isSelected = selectedAnswer === option;
                    const isOptionCorrect = option === q.correctAnswer;
                    
                    let btnStyle = "border-border hover:bg-muted/40 hover:border-muted-foreground/30";
                    if (isSelected) {
                      btnStyle = "border-primary bg-primary/5 text-primary";
                    }
                    if (isRevealed) {
                      if (isOptionCorrect) {
                        btnStyle = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-semibold";
                      } else if (isSelected) {
                        btnStyle = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                      } else {
                        btnStyle = "border-border opacity-50";
                      }
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleSelectOption(qIndex, option)}
                        disabled={isRevealed}
                        className={`w-full p-4 text-left text-sm rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="leading-relaxed">{option}</span>
                        {isRevealed && isOptionCorrect && <Check className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />}
                        {isRevealed && isSelected && !isOptionCorrect && <X className="w-4 h-4 text-red-500 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Input for Short Answer */}
              {q.type === "short-answer" && (
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Type your answer here to self-test..."
                    value={selectedAnswer || ""}
                    onChange={(e) => setSelectedAnswers((prev) => ({ ...prev, [qIndex]: e.target.value }))}
                    disabled={isRevealed}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                  />
                </div>
              )}

              {/* Reveal Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-border/60 pt-4 gap-4">
                <div className="flex-grow">
                  {isRevealed ? (
                    <div className="flex items-center space-x-2 text-sm w-full">
                      {q.type !== "short-answer" ? (
                        selectedAnswer ? (
                          isCorrect ? (
                            <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
                              <Check className="w-4 h-4 mr-1" /> Correct!
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 font-bold flex items-center">
                              <X className="w-4 h-4 mr-1" /> Incorrect. Correct option was "{q.correctAnswer}".
                            </span>
                          )
                        ) : (
                          <span className="text-muted-foreground flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" /> Not answered. Correct was "{q.correctAnswer}".
                          </span>
                        )
                      ) : (
                        <div className="bg-muted/40 p-4 rounded-xl border border-border w-full">
                          <strong className="text-xs text-primary block uppercase mb-1">Correct Answer Guide:</strong>
                          <span className="text-foreground text-sm leading-relaxed">{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    selectedAnswer && q.type !== "short-answer" && (
                      <span className="text-xs text-muted-foreground">Answer selected. Reveal to check.</span>
                    )
                  )}
                </div>

                {!showAllAnswers && (
                  <button
                    onClick={() => toggleRevealAnswer(qIndex)}
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide Answer</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Reveal Answer</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
