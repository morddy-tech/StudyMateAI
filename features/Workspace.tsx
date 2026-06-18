"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  List, 
  Bookmark, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Trash2, 
  UploadCloud, 
  Check, 
  Copy, 
  Download, 
  Printer, 
  Loader2, 
  Sun, 
  Moon, 
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { StudyKitResult } from "@/types";
import { extractTextFromPDF, extractTextFromTXT } from "@/utils/pdfParser";
import { formatResultToMarkdown, downloadMarkdownFile } from "@/utils/exportUtils";

// Import result views
import SummaryView from "@/components/SummaryView";
import ExplainSimplyView from "@/components/ExplainSimplyView";
import KeyPointsView from "@/components/KeyPointsView";
import GlossaryView from "@/components/GlossaryView";
import FlashcardsView from "@/components/FlashcardsView";
import QuizView from "@/components/QuizView";
import StudyGuideView from "@/components/StudyGuideView";

interface WorkspaceProps {
  onBack: () => void;
}

const ACTION_OPTIONS = [
  { id: "summary", label: "Generate Summary", icon: FileText },
  { id: "explainSimply", label: "Explain Simply", icon: Sparkles },
  { id: "keyPoints", label: "Extract Key Points", icon: List },
  { id: "definitions", label: "Extract Definitions", icon: Bookmark },
  { id: "flashcards", label: "Generate Flashcards", icon: BookOpen },
  { id: "quiz", label: "Generate Quiz", icon: HelpCircle },
  { id: "studyGuide", label: "Generate Study Guide", icon: Layers }
];

const LOADING_MESSAGES = [
  "Reading your document...",
  "Extracting key concepts...",
  "Analyzing theme structure...",
  "Generating summaries...",
  "Creating flashcards...",
  "Preparing quizzes...",
  "Structuring study guide...",
  "Almost ready, polishing results..."
];

export default function Workspace({ onBack }: WorkspaceProps) {
  const { theme, toggleTheme } = useTheme();

  // Inputs
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  
  // Progress/Loading States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Selected Actions
  const [selectedActions, setSelectedActions] = useState<string[]>(["summary", "explainSimply"]);
  
  // Results
  const [results, setResults] = useState<StudyKitResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const [copiedAll, setCopiedAll] = useState(false);
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotates loading messages
  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Set active tab automatically when results generated
  useEffect(() => {
    if (results) {
      // Find the first action in selectedActions that is present in results
      const availableTabs = ACTION_OPTIONS.filter(opt => selectedActions.includes(opt.id) && results[opt.id as keyof StudyKitResult]);
      if (availableTabs.length > 0) {
        setActiveTab(availableTabs[0].id);
      }
    }
  }, [results, selectedActions]);

  const toggleAction = (actionId: string) => {
    setSelectedActions((prev) => {
      if (prev.includes(actionId)) {
        // Keep at least one checked
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setInputText("");
    setError(null);
    setIsParsing(true);
    setUploadProgress(0);

    try {
      let text = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        text = await extractTextFromPDF(file, (progress) => {
          setUploadProgress(progress);
        });
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        setUploadProgress(50);
        text = await extractTextFromTXT(file);
        setUploadProgress(100);
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or TXT file.");
      }

      if (!text || !text.trim()) {
        throw new Error("The uploaded file did not contain any extractable text.");
      }

      setInputText(text);
    } catch (err: any) {
      setError(err.message || "Failed to extract text from file.");
      setFileName("");
      setInputText("");
    } finally {
      setIsParsing(false);
      setUploadProgress(0);
    }
  };

  const handleClearFile = () => {
    setFileName("");
    setInputText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!inputText || !inputText.trim()) {
      setError("Please upload a file or paste study text manually.");
      return;
    }
    if (selectedActions.length === 0) {
      setError("Please select at least one study action.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults(null);
    setLoadingMessageIndex(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          actions: selectedActions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed. Please try again.");
      }

      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Export handlers
  const handleCopyAll = () => {
    if (!results) return;
    const md = formatResultToMarkdown(results);
    navigator.clipboard.writeText(md);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!results) return;
    const md = formatResultToMarkdown(results);
    downloadMarkdownFile(md, `${fileName.replace(/\.[^/.]+$/, "") || "studymate"}-kit.md`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <header className="h-16 glass border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 print:hidden transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted border border-border transition-all cursor-pointer flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">Exit Workspace</span>
          </button>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <span className="font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              StudyMate AI
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted border border-border transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-4rem)]">
        {/* Left Input Panel */}
        <section className="w-full lg:w-5/12 border-r border-border bg-card p-4 sm:p-6 flex flex-col overflow-y-auto print:hidden transition-colors duration-300">
          <div className="space-y-6 flex-grow">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">Study Materials</h2>
              <p className="text-xs text-muted-foreground">Import your textbooks, notes, or research documents.</p>
            </div>

            {/* Document Upload Box */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                File Ingest (PDF or TXT)
              </label>
              
              {!fileName ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.txt"
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Upload study document</p>
                  <p className="text-xs text-muted-foreground">PDF or TXT up to 25MB</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold truncate text-foreground pr-2">{fileName}</span>
                  </div>
                  <button
                    onClick={handleClearFile}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Parsing Progress Bar */}
              {isParsing && (
                <div className="space-y-1.5 bg-muted/50 p-4 rounded-xl border border-border">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground flex items-center">
                      <Loader2 className="w-3 h-3 animate-spin mr-1.5 text-primary" />
                      Parsing file contents...
                    </span>
                    <span className="font-bold text-primary">{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Manual Text Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Manual Paste
              </label>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (fileName) setFileName(""); // Switch to manual state if typing
                }}
                disabled={isParsing || isGenerating}
                placeholder="Paste textbooks, essays, meeting notes, lectures, or paragraphs directly here..."
                className="w-full h-40 px-4 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm leading-relaxed transition-all resize-none disabled:opacity-50"
              />
              {inputText && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Characters: {inputText.length}</span>
                  <span>Words: {inputText.trim().split(/\s+/).filter(Boolean).length}</span>
                </div>
              )}
            </div>

            {/* AI Action Multi-Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Study Materials to Generate
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ACTION_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isChecked = selectedActions.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleAction(opt.id)}
                      disabled={isGenerating}
                      className={`p-3 text-left border rounded-xl flex items-center space-x-3 transition-all cursor-pointer disabled:opacity-50 ${
                        isChecked
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          isChecked
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-semibold">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="mt-8 border-t border-border/60 pt-4 bg-card z-10 sticky bottom-0">
            {error && (
              <div className="mb-4 bg-destructive/10 border border-destructive/20 text-destructive p-3.5 rounded-xl text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={isParsing || isGenerating || !inputText.trim()}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground hover:opacity-95 shadow-lg shadow-primary/20 font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Study Kit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>Generate Study Kit</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Output Panel */}
        <section className="w-full lg:w-7/12 bg-background flex flex-col overflow-y-auto transition-colors duration-300">
          {/* Empty State */}
          {!isGenerating && !results && (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto print:hidden">
              <div className="w-20 h-20 rounded-3xl bg-secondary/80 flex items-center justify-center mb-6 shadow-inner border border-border">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Study Workspace</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Upload a PDF/TXT document or paste raw texts in the Left Panel to compile your personalized summaries, definitions, quizzes, and structured revision books.
              </p>
              <div className="flex items-center space-x-2 text-xs font-semibold text-primary px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Upload a document to begin learning smarter</span>
              </div>
            </div>
          )}

          {/* Loading Experience */}
          {isGenerating && (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto print:hidden">
              <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Analyzing Material</h3>
              <p className="text-sm text-muted-foreground animate-pulse leading-relaxed min-h-[3rem]">
                {LOADING_MESSAGES[loadingMessageIndex]}
              </p>
            </div>
          )}

          {/* Results Display Area */}
          {!isGenerating && results && (
            <div className="flex-grow flex flex-col h-full">
              {/* Export Panel Header */}
              <div className="h-14 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between shrink-0 print:hidden transition-colors duration-300">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Generated Kit Actions
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyAll}
                    className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center space-x-1 text-xs font-semibold bg-card"
                    title="Copy Markdown of all generated files"
                  >
                    {copiedAll ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copiedAll ? "Copied" : "Copy All"}</span>
                  </button>
                  <button
                    onClick={handleDownloadMarkdown}
                    className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center space-x-1 text-xs font-semibold bg-card"
                    title="Download Markdown kit file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download MD</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center space-x-1 text-xs font-semibold bg-card"
                    title="Print study material"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                </div>
              </div>

              {/* Layout Content Body */}
              <div className="flex-grow flex flex-col md:flex-row overflow-hidden h-full">
                {/* Tab Navigation Menu */}
                <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border bg-card flex md:flex-col overflow-x-auto md:overflow-x-hidden md:overflow-y-auto shrink-0 print:hidden transition-colors duration-300">
                  <div className="p-2 md:p-3 flex md:flex-col gap-1 w-full shrink-0 md:shrink">
                    {ACTION_OPTIONS.filter((opt) => selectedActions.includes(opt.id) && results[opt.id as keyof StudyKitResult]).map((opt) => {
                      const Icon = opt.icon;
                      const isActive = activeTab === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setActiveTab(opt.id)}
                          className={`px-3.5 py-3.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2.5 whitespace-nowrap md:w-full ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/15"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span>{opt.label.replace("Generate ", "").replace("Extract ", "")}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subcomponent view panel */}
                <div className="flex-grow p-6 sm:p-8 overflow-y-auto print:p-0 print:overflow-visible h-[calc(100vh-11.5rem)] md:h-[calc(100vh-7.5rem)] print:h-auto">
                  <div className="max-w-4xl mx-auto print:max-w-none">
                    {activeTab === "summary" && results.summary && <SummaryView data={results.summary} />}
                    {activeTab === "explainSimply" && results.explainSimply && <ExplainSimplyView data={results.explainSimply} />}
                    {activeTab === "keyPoints" && results.keyPoints && <KeyPointsView data={results.keyPoints} />}
                    {activeTab === "definitions" && results.definitions && <GlossaryView data={results.definitions} />}
                    {activeTab === "flashcards" && results.flashcards && <FlashcardsView data={results.flashcards} />}
                    {activeTab === "quiz" && results.quiz && <QuizView data={results.quiz} />}
                    {activeTab === "studyGuide" && results.studyGuide && <StudyGuideView data={results.studyGuide} />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer (Mobile/Sidebar print details) */}
      <footer className="h-12 border-t border-border bg-card shrink-0 flex items-center justify-between px-4 sm:px-6 print:hidden text-xs text-muted-foreground transition-colors duration-300">
        <div>
          Developed by: <strong className="text-foreground">Ifedayo Matthew</strong> (ifedmord5194@gmail.com)
        </div>
        <div>
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-bold inline-flex items-center space-x-0.5"
          >
            <span>Built for Digital Heroes</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
