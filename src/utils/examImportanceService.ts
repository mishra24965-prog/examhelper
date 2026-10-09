/**
 * Unified Exam Importance & Multi-MST Cross-Reference Service
 * Powered by Semantic Vector Embedding & Cosine Similarity Engine
 */

export {
  computeTopicExamImportance,
  computeCourseExamIntelligenceSummary,
  getQuestionExamImportance,
  mapQuestionToSyllabus,
  reMapCourseQuestionsWithEmbeddings,
  computeCosineSimilarity
} from './semanticEmbeddingService';

export type {
  SemanticMappingResult,
  SparseEmbeddingVector
} from './semanticEmbeddingService';
