import mongoose, { Schema, Document, Model } from 'mongoose';

// Experience item interface
export interface IExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
}

// Education item interface
export interface IEducationItem {
  institution: string;
  degree: string;
  year: string;
}

// Improvement suggestion interface
export interface IImprovementSuggestion {
  section: string;
  suggestion: string;
  importance: 'high' | 'medium' | 'low';
}

// Resume document interface
export interface IResume extends Document {
  clerkId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  extractedText: string;
  parsedSections: {
    summary: string | null;
    experience: IExperienceItem[];
    education: IEducationItem[];
    skills: string[];
    certifications: string[];
  };
  analysis: {
    overallScore: number | null;
    atsScore: number | null;
    sectionScores: {
      impact: number;
      brevity: number;
      style: number;
      skills: number;
    } | null;
    missingKeywords: string[];
    improvementSuggestions: IImprovementSuggestion[];
  } | null;
  isDefault: boolean;
  createdAt: Date;
  analyzedAt: Date | null;
}

// Static methods interface
// Static methods interface
interface IResumeModel extends Model<IResume> {
  createResume(data: Partial<IResume>): Promise<IResume>;
  findByClerkId(clerkId: string): Promise<IResume[]>;
  findDefault(clerkId: string): Promise<IResume | null>;
  setDefault(clerkId: string, resumeId: string): Promise<void>;
  updateAnalysis(resumeId: string, analysis: IResume['analysis']): Promise<IResume | null>;
  deleteById(resumeId: string, clerkId: string): Promise<boolean>;
}

// Experience schema definition
const ExperienceSchema = new Schema<IExperienceItem>(
  {
    title: String,
    company: String,
    duration: String,
    description: String,
  },
  { _id: false }
);

// Education schema definition
const EducationSchema = new Schema<IEducationItem>(
  {
    institution: String,
    degree: String,
    year: String,
  },
  { _id: false }
);

// Improvement suggestion schema definition
const ImprovementSuggestionSchema = new Schema<IImprovementSuggestion>(
  {
    section: String,
    suggestion: String,
    importance: {
      type: String,
      enum: ['high', 'medium', 'low'],
    },
  },
  { _id: false }
);

// Parsed sections schema
const ParsedSectionsSchema = new Schema(
  {
    summary: String,
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [String],
    certifications: [String],
  },
  { _id: false }
);

// Analysis schema definition
const AnalysisSchema = new Schema(
  {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    sectionScores: {
      impact: { type: Number, min: 0, max: 100 },
      brevity: { type: Number, min: 0, max: 100 },
      style: { type: Number, min: 0, max: 100 },
      skills: { type: Number, min: 0, max: 100 },
    },
    missingKeywords: [String],
    improvementSuggestions: [ImprovementSuggestionSchema],
  },
  { _id: false }
);

// Resume schema definition
const ResumeSchema = new Schema<IResume>(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      enum: ['application/pdf'],
    },
    extractedText: {
      type: String,
      default: '',
    },
    parsedSections: ParsedSectionsSchema,
    analysis: AnalysisSchema,
    isDefault: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    analyzedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
ResumeSchema.index({ clerkId: 1, isDefault: 1 });
ResumeSchema.index({ createdAt: -1 });

// Static methods
ResumeSchema.statics.createResume = async function (data: Partial<IResume>): Promise<IResume> {
  // If this is the first resume, make it default
  const existingCount = await this.countDocuments({ clerkId: data.clerkId });

  const resume = new this({
    ...data,
    isDefault: existingCount === 0,
  });

  return resume.save();
};

ResumeSchema.statics.findByClerkId = async function (clerkId: string): Promise<IResume[]> {
  return this.find({ clerkId }).sort({ createdAt: -1 });
};

ResumeSchema.statics.findDefault = async function (clerkId: string): Promise<IResume | null> {
  return this.findOne({ clerkId, isDefault: true });
};

ResumeSchema.statics.setDefault = async function (
  clerkId: string,
  resumeId: string
): Promise<void> {
  // Unset current default
  await this.updateMany({ clerkId }, { $set: { isDefault: false } });

  // Set new default
  await this.findByIdAndUpdate(resumeId, { $set: { isDefault: true } });
};

ResumeSchema.statics.updateAnalysis = async function (
  resumeId: string,
  analysis: IResume['analysis']
): Promise<IResume | null> {
  return this.findByIdAndUpdate(
    resumeId,
    {
      $set: {
        analysis,
        analyzedAt: new Date(),
      },
    },
    { new: true }
  );
};

ResumeSchema.statics.deleteById = async function (
  resumeId: string,
  clerkId: string
): Promise<boolean> {
  const result = await this.deleteOne({ _id: resumeId, clerkId });
  return result.deletedCount === 1;
};

const _Resume =
  mongoose.models.Resume || mongoose.model<IResume, IResumeModel>('Resume', ResumeSchema);

const Resume = _Resume as unknown as IResumeModel;

export default Resume;
