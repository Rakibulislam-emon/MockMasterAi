import mongoose, { Schema, Document, Model } from 'mongoose';

// Question document interface
export interface IQuestion extends Document {
  category: string;
  subcategory: string | null;
  difficulty: number;
  questionEn: string;
  questionBn: string | null;
  modelAnswerEn: string | null;
  modelAnswerBn: string | null;
  evaluationCriteria: {
    criterion: string;
    description: string;
    keywords: string[];
    maxPoints: number;
  }[];
  tags: string[];
  usageCount: number;
  averageRating: number;
  createdBy: 'admin' | 'ai-generated';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Evaluation criteria schema definition
const EvaluationCriteriaSchema = new Schema(
  {
    criterion: String,
    description: String,
    keywords: [String],
    maxPoints: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  { _id: false }
);

// Question schema definition
const QuestionSchema = new Schema<IQuestion>(
  {
    category: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      default: null,
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    questionEn: {
      type: String,
      required: true,
    },
    questionBn: {
      type: String,
      default: null,
    },
    modelAnswerEn: {
      type: String,
      default: null,
    },
    modelAnswerBn: {
      type: String,
      default: null,
    },
    evaluationCriteria: [EvaluationCriteriaSchema],
    tags: [String],
    usageCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      enum: ['admin', 'ai-generated'],
      default: 'ai-generated',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
QuestionSchema.index({ category: 1, subcategory: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ isActive: 1 });
QuestionSchema.index({ difficulty: 1 });

// Static methods
QuestionSchema.statics.findByCategory = async function (
  category: string,
  options: { limit?: number; skip?: number } = {}
): Promise<IQuestion[]> {
  return this.find({ category, isActive: true })
    .sort({ usageCount: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 50);
};

QuestionSchema.statics.findRandom = async function (
  filters: {
    category?: string;
    difficulty?: number;
    tags?: string[];
  },
  limit: number = 10
): Promise<IQuestion[]> {
  const query: Record<string, unknown> = { isActive: true };

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  // Random aggregation pipeline
  return this.aggregate([{ $match: query }, { $sample: { size: limit } }]);
};

QuestionSchema.statics.findActiveById = async function (
  questionId: string
): Promise<IQuestion | null> {
  return this.findOne({ _id: questionId, isActive: true });
};

QuestionSchema.statics.incrementUsage = async function (questionId: string): Promise<void> {
  await this.findByIdAndUpdate(questionId, { $inc: { usageCount: 1 } });
};

QuestionSchema.statics.getCategories = async function (): Promise<string[]> {
  return this.distinct('category', { isActive: true });
};

QuestionSchema.statics.getSubcategories = async function (category: string): Promise<string[]> {
  return this.distinct('subcategory', { category, isActive: true, subcategory: { $ne: null } });
};

QuestionSchema.statics.search = async function (
  searchTerm: string,
  options: { limit?: number; skip?: number } = {}
): Promise<IQuestion[]> {
  return this.find({
    isActive: true,
    $or: [
      { questionEn: { $regex: searchTerm, $options: 'i' } },
      { tags: { $regex: searchTerm, $options: 'i' } },
    ],
  })
    .sort({ usageCount: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20);
};

// Static methods interface
interface IQuestionModel extends Model<IQuestion> {
  findByCategory(
    category: string,
    options?: { limit?: number; skip?: number }
  ): Promise<IQuestion[]>;
  findRandom(
    filters: {
      category?: string;
      difficulty?: number;
      tags?: string[];
    },
    limit?: number
  ): Promise<IQuestion[]>;
  findActiveById(questionId: string): Promise<IQuestion | null>;
  incrementUsage(questionId: string): Promise<void>;
  getCategories(): Promise<string[]>;
  getSubcategories(category: string): Promise<string[]>;
  search(searchTerm: string, options?: { limit?: number; skip?: number }): Promise<IQuestion[]>;
}

const Question = (mongoose.models.Question ||
  mongoose.model<IQuestion, IQuestionModel>(
    'Question',
    QuestionSchema
  )) as unknown as IQuestionModel;

export default Question;
