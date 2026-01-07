'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Resume, { type IImprovementSuggestion } from '@/lib/models/Resume';
import { groqService } from '@/lib/ai/groq';
import type { ApiResponse } from '@/types';

/**
 * Upload and analyze a resume
 */
export async function uploadResume(file: {
  name: string;
  size: number;
  type: string;
  content: string;
}): Promise<
  ApiResponse<{
    resumeId: string;
    analysis: {
      overallScore: number;
      atsScore: number;
      missingKeywords: string[];
      improvementSuggestions: Array<{
        section: string;
        suggestion: string;
        importance: string;
      }>;
    };
  }>
> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    // Validate file
    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Only PDF files are supported' };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    // In production, upload to cloud storage and extract text
    // For now, we'll simulate with the provided content
    const extractedText = file.content;

    // Create resume record
    const resume = await Resume.createResume({
      clerkId: userId,
      fileName: file.name,
      fileUrl: `https://storage.example.com/resumes/${userId}/${file.name}`,
      fileSize: file.size,
      mimeType: file.type,
      extractedText,
      parsedSections: {
        summary: null,
        experience: [],
        education: [],
        skills: [],
        certifications: [],
      },
      isDefault: false,
    });

    // Analyze resume using AI
    const analysis = await analyzeResumeContent(extractedText);

    // Update resume with analysis
    await Resume.updateAnalysis(resume._id.toString(), analysis);

    revalidatePath('/resumes');

    return {
      success: true,
      data: {
        resumeId: resume._id.toString(),
        analysis,
      },
    };
  } catch (error) {
    console.error('Error uploading resume:', error);
    return { success: false, error: 'Failed to upload resume' };
  }
}

/**
 * Get all user resumes
 */
export async function getUserResumes(): Promise<
  ApiResponse<
    Array<{
      id: string;
      fileName: string;
      createdAt: Date;
      analyzedAt: Date | null;
      isDefault: boolean;
      analysis: {
        overallScore: number | null;
        atsScore: number | null;
      } | null;
    }>
  >
> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const resumes = await Resume.findByClerkId(userId);

    const formattedResumes = resumes.map(r => ({
      id: r._id.toString(),
      fileName: r.fileName,
      createdAt: r.createdAt,
      analyzedAt: r.analyzedAt,
      isDefault: r.isDefault,
      analysis: r.analysis
        ? {
            overallScore: r.analysis.overallScore,
            atsScore: r.analysis.atsScore,
          }
        : null,
    }));

    return { success: true, data: formattedResumes };
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return { success: false, error: 'Failed to fetch resumes' };
  }
}

/**
 * Delete a resume
 */
export async function deleteResume(resumeId: string): Promise<ApiResponse<null>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const deleted = await Resume.deleteById(resumeId, userId);

    if (!deleted) {
      return { success: false, error: 'Resume not found' };
    }

    revalidatePath('/resumes');

    return { success: true, data: null };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return { success: false, error: 'Failed to delete resume' };
  }
}

/**
 * Set a resume as default
 */
export async function setDefaultResume(resumeId: string): Promise<ApiResponse<null>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    await Resume.setDefault(userId, resumeId);

    revalidatePath('/resumes');

    return { success: true, data: null };
  } catch (error) {
    console.error('Error setting default resume:', error);
    return { success: false, error: 'Failed to set default resume' };
  }
}

/**
 * Get resume details including parsed content
 */
export async function getResumeDetails(resumeId: string): Promise<
  ApiResponse<{
    fileName: string;
    extractedText: string;
    parsedSections: Record<string, unknown>;
    analysis: Record<string, unknown> | null;
  }>
> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const resume = await Resume.findOne({
      _id: resumeId,
      clerkId: userId,
    });

    if (!resume) {
      return { success: false, error: 'Resume not found' };
    }

    return {
      success: true,
      data: {
        fileName: resume.fileName,
        extractedText: resume.extractedText,
        parsedSections: resume.parsedSections,
        analysis: resume.analysis,
      },
    };
  } catch (error) {
    console.error('Error fetching resume details:', error);
    return { success: false, error: 'Failed to fetch resume details' };
  }
}

// Helper function to analyze resume content
async function analyzeResumeContent(resumeText: string): Promise<{
  overallScore: number;
  atsScore: number;
  missingKeywords: string[];
  improvementSuggestions: IImprovementSuggestion[];
}> {
  try {
    // Use AI to analyze the resume
    const prompt = `
      Analyze the following resume and provide structured feedback.
      
      Resume:
      ${resumeText.slice(0, 3000)}...
      
      Provide analysis in JSON format:
      {
        "overallScore": number (0-100),
        "atsScore": number (0-100),
        "missingKeywords": ["list of missing keywords"],
        "improvementSuggestions": [
          {
            "section": "section name",
            "suggestion": "specific suggestion",
            "importance": "high|medium|low"
          }
        ]
      }
    `;

    const result = await groqService.generateContent(prompt, {
      preferFast: true,
      maxTokens: 512,
    });

    // Parse the response - handle various formats
    let cleanedResult = result.trim();

    // Remove markdown code fences if present
    cleanedResult = cleanedResult.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

    // Try to find JSON object in the response
    const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResult = jsonMatch[0];
    }

    return JSON.parse(cleanedResult);
  } catch (error) {
    console.error('Error analyzing resume:', error);

    // Return default analysis on error
    return {
      overallScore: 70,
      atsScore: 65,
      missingKeywords: ['achievements', 'metrics', 'leadership'],
      improvementSuggestions: [
        {
          section: 'Summary',
          suggestion: 'Add a compelling summary that highlights your key achievements.',
          importance: 'high',
        },
        {
          section: 'Experience',
          suggestion: 'Use bullet points with action verbs and quantifiable results.',
          importance: 'medium',
        },
      ],
    };
  }
}
