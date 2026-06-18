export interface SummaryResult {
  short: string;
  medium: string;
  detailed: string;
}

export interface KeyPointResult {
  point: string;
  iconName: string;
}

export interface DefinitionResult {
  term: string;
  definition: string;
}

export interface FlashcardResult {
  front: string;
  back: string;
}

export interface QuizQuestionResult {
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string;
}

export interface StudyGuideResult {
  overview: string;
  mainConcepts: { concept: string; description: string }[];
  definitions: { term: string; definition: string }[];
  examples: string[];
  revisionNotes: string;
  practiceQuestions: string[];
  studyTips: string[];
}

export interface StudyKitResult {
  summary?: SummaryResult;
  explainSimply?: string;
  keyPoints?: KeyPointResult[];
  definitions?: DefinitionResult[];
  flashcards?: FlashcardResult[];
  quiz?: QuizQuestionResult[];
  studyGuide?: StudyGuideResult;
}
