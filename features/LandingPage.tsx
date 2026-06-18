"use client";

import React from "react";
import { useTheme } from "@/components/theme-provider";
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Sparkles, 
  FileText, 
  HelpCircle, 
  Layers, 
  Download, 
  ArrowRight, 
  Github, 
  Cpu, 
  User, 
  Mail, 
  ExternalLink 
} from "lucide-react";
import { motion } from "framer-motion";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Simplified item variants without explicit transition
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0 
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              StudyMate AI
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button onClick={() => handleScroll("features")} className="hover:text-primary transition-colors cursor-pointer text-muted-foreground">
              Features
            </button>
            <button onClick={() => handleScroll("how-it-works")} className="hover:text-primary transition-colors cursor-pointer text-muted-foreground">
              How it Works
            </button>
            <button onClick={() => handleScroll("about")} className="hover:text-primary transition-colors cursor-pointer text-muted-foreground">
              About
            </button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors flex items-center space-x-1 text-muted-foreground"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted border border-border transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button
              onClick={onStart}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-all cursor-pointer flex items-center space-x-1"
            >
              <span>Start Studying</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden flex-grow flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] w-[80%] aspect-square rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-[40%] -right-[20%] w-[80%] aspect-square rounded-full bg-indigo-500/10 blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wide uppercase mb-6"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI-Powered Study Companion</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight sm:leading-none"
          >
            Turn textbooks, lecture notes, readings, and meeting notes into{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              simple study guides
            </span>{" "}
            in seconds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Upload PDFs, text documents, or paste notes directly. StudyMate AI extracts summaries, definitions, key points, interactive quizzes, and flashcards so you learn faster and retain more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Start Studying for Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("features")}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl bg-secondary text-secondary-foreground hover:bg-muted border border-border transition-all cursor-pointer flex items-center justify-center"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/50 border-y border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Supercharge Your Learning Loop
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to digest dense information and ace your exams, certifications, or work briefs.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div 
              variants={itemVariants} 
              transition={{ duration: 0.5 }}
              className="bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant File Parsing</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                Drag and drop your textbooks, papers, or lecture notes. We parse PDF and TXT files instantly and extract clean text right in your browser.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={itemVariants} 
              transition={{ duration: 0.5 }}
              className="bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Action Generation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                Select from 7 different study operations simultaneously. Generate summaries, explanations, quiz suites, and guides all in a single run.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={itemVariants} 
              transition={{ duration: 0.5 }}
              className="bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Flashcards</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                Practice active recall with interactive 3D flipping flashcards. Perfect for memorizing complex definitions, dates, and core concepts.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              variants={itemVariants} 
              transition={{ duration: 0.5 }}
              className="bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Practice Quizzes</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                Test your understanding with generated quizzes including Multiple Choice, True/False, and Short Answer questions with interactive answer reveals.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              variants={itemVariants} 
              transition={{ duration: 0.5 }}
              className="bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Explain Simply</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                Explain complex and academic jargon in a teenager-friendly way, with real-world analogies. Ideal for starting out with a new topic.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              variants={itemVariants} 
              transition={{ duration: 0.5 }}
              className="bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Exports</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                Copy results to your clipboard, download formatted markdown files for Obsidian, Notion or Logseq, or print customized study templates immediately.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Study Smarter in 3 Simple Steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A frictionless workflow built directly in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 hidden md:block z-0" />
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center bg-background p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg shadow-md mb-6">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Import Study Material</h3>
              <p className="text-sm text-muted-foreground">
                Upload a PDF or TXT file, or paste your text notes manually directly into the input area.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center bg-background p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg shadow-md mb-6">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">Select Study Actions</h3>
              <p className="text-sm text-muted-foreground">
                Choose actions: summaries, simple explanations, quizzes, definitions, or structured guides.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center bg-background p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg shadow-md mb-6">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">Master the Content</h3>
              <p className="text-sm text-muted-foreground">
                Interact with flashcards and quizzes, read revision summaries, export your work, and pass your classes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-secondary/20 border-b border-border transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-6">
            About StudyMate AI
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            StudyMate AI was built with a clear purpose: to democratize advanced learning strategies. By utilizing cutting-edge Large Language Models, StudyMate AI breaks down dense textbooks, convoluted research, and scattered lecture notes into tailored study kits. It enforces proven learning science techniques—like **spaced repetition**, **active recall**, and the **Feynman technique**—through interactive flashcards, self-grading quizzes, and jargon-free summaries.
          </p>
          <div className="inline-flex items-center space-x-2 text-primary font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>Synthesizing intelligence to empower learners worldwide.</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground border-t border-border py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight">StudyMate AI</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4 text-primary" />
              <span>Developed by: <strong className="text-foreground">Ifedayo Matthew</strong></span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4 text-primary" />
              <a href="mailto:ifedmord5194@gmail.com" className="hover:text-primary transition-colors">
                ifedmord5194@gmail.com
              </a>
            </div>
          </div>

          <div>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold text-sm tracking-wide inline-flex items-center space-x-2"
            >
              <span>Built for Digital Heroes</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} StudyMate AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}