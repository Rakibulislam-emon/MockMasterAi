import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Question from '@/lib/models/Question';

// Validation Schemas
const getQuestionsSchema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
  difficulty: z.coerce.number().min(1).max(5).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  skip: z.coerce.number().min(0).default(0),
});

const evaluationCriteriaSchema = z.object({
  criterion: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  maxPoints: z.number().min(1).max(10),
});

const createQuestionSchema = z.object({
  category: z.string().min(1),
  subcategory: z.string().nullable().optional(),
  difficulty: z.number().min(1).max(5).default(3),
  questionEn: z.string().min(1),
  questionBn: z.string().nullable().optional(),
  modelAnswerEn: z.string().nullable().optional(),
  modelAnswerBn: z.string().nullable().optional(),
  evaluationCriteria: z.array(evaluationCriteriaSchema).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const params = {
      category: searchParams.get('category') || undefined,
      subcategory: searchParams.get('subcategory') || undefined,
      difficulty: searchParams.get('difficulty') || undefined,
      limit: searchParams.get('limit') || undefined,
      skip: searchParams.get('skip') || undefined,
    };

    const validationResult = getQuestionsSchema.safeParse(params);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { category, subcategory, difficulty, limit, skip } = validationResult.data;

    await connectDB();

    const query: Record<string, unknown> = { isActive: true };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.find(query)
      .sort({ usageCount: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Question.countDocuments(query);

    return NextResponse.json({
      items: questions,
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      hasMore: skip + questions.length < total,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admin to create questions (in production, check admin role)
    const body = await req.json();

    const validationResult = createQuestionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid question data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    await connectDB();

    const question = await Question.create({
      ...validationResult.data,
      usageCount: 0,
      averageRating: 0,
      createdBy: 'admin',
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
