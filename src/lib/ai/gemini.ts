import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Get the model instance
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// Configuration for the model
const generationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 0.95,
  maxOutputTokens: 2048,
  responseMimeType: 'application/json',
};

// Create a chat session for conversation
export function createChatSession() {
  return model.startChat({
    generationConfig,
    history: [],
  });
}

/**
 * Generate content using Gemini Flash
 * @param prompt - The prompt to send to the model
 * @returns The generated text response
 */
export async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw error;
  }
}

/**
 * Generate content with a chat history
 * @param history - Array of {role, parts} messages
 * @param newMessage - The new message to send
 * @returns The generated text response
 */
export async function generateWithHistory(
  history: Array<{ role: string; content: string }>,
  newMessage: string
): Promise<string> {
  try {
    const chat = createChatSession();

    // Add history to the chat
    for (const message of history) {
      await chat.sendMessageStream(message.content);
    }

    // Generate response to new message
    const result = await chat.sendMessage(newMessage);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error('Error generating with history:', error);
    throw error;
  }
}

/**
 * Analyze resume content and extract key information
 * @param resumeText - The extracted text from the resume
 * @returns Analysis results including skills, experience, and suggestions
 */
export async function analyzeResume(resumeText: string): Promise<{
  skills: string[];
  experience: string[];
  education: string[];
  suggestions: string[];
  atsCompatibility: number;
}> {
  const prompt = `
    You are an expert resume analyzer. Analyze the following resume and provide structured feedback.
    
    Resume Content:
    ${resumeText}
    
    Please provide a JSON response with the following structure:
    {
      "skills": ["list of technical and soft skills identified"],
      "experience": ["summary of work experience"],
      "education": ["educational qualifications"],
      "suggestions": ["specific improvement suggestions"],
      "atsCompatibility": number from 0-100 (ATS compatibility score)
    }
    
    Focus on identifying:
    1. Technical skills (programming languages, frameworks, tools)
    2. Soft skills (leadership, communication, teamwork)
    3. Experience level and domain expertise
    4. Areas that need improvement for job applications
    5. Missing keywords that would help with ATS systems
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    // Remove any markdown code block formatting
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

/**
 * Generate interview feedback based on conversation
 * @param conversation - Array of messages from the interview
 * @param targetRole - The role being interviewed for
 * @returns Comprehensive feedback analysis
 */
export async function generateInterviewFeedback(
  conversation: Array<{ role: string; content: string }>,
  targetRole: string
): Promise<{
  overallScore: number;
  contentScore: number;
  languageScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: Array<{
    category: string;
    description: string;
    suggestedResponse: string;
    explanation: string;
  }>;
  suggestedResources: Array<{
    type: 'article' | 'video' | 'practice';
    title: string;
    url: string;
  }>;
}> {
  const prompt = `
    You are an expert interview coach. Analyze the following interview conversation and provide comprehensive feedback.
    
    Target Role: ${targetRole}
    
    Conversation:
    ${conversation.map(m => `${m.role}: ${m.content}`).join('\n')}
    
    Please provide detailed feedback in JSON format:
    {
      "overallScore": number (0-100),
      "contentScore": number (0-100) - relevance and depth of answers,
      "languageScore": number (0-100) - grammar and vocabulary,
      "confidenceScore": number (0-100) - communication confidence,
      "strengths": ["list of identified strengths"],
      "improvements": [
        {
          "category": "specific area for improvement",
          "description": "detailed observation",
          "suggestedResponse": "example of better response",
          "explanation": "why this is better"
        }
      ],
      "suggestedResources": [
        {
          "type": "article|video|practice",
          "title": "resource title",
          "url": "resource URL"
        }
      ]
    }
    
    Be specific and constructive in your feedback. Include actionable suggestions.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating interview feedback:', error);
    throw error;
  }
}

/**
 * Generate personalized interview questions based on resume and role
 * @param targetRole - The role being prepared for
 * @param resumeText - The user's resume text
 * @param difficulty - Difficulty level (easy, medium, hard)
 * @param count - Number of questions to generate
 * @returns Array of interview questions
 */
export async function generateInterviewQuestions(
  targetRole: string,
  resumeText: string,
  difficulty: string,
  count: number = 5
): Promise<
  Array<{
    question: string;
    category: string;
    expectedPoints: string[];
  }>
> {
  const prompt = `
    You are an expert interviewer for ${targetRole} positions. Based on the following resume, generate ${count} ${difficulty} interview questions.
    
    Resume:
    ${resumeText}
    
    Please generate questions that:
    1. Are relevant to the candidate's experience and skills
    2. Test both technical knowledge and soft skills
    3. Are appropriate for the ${difficulty} difficulty level
    
    Return a JSON array with this structure:
    [
      {
        "question": "the interview question",
        "category": "behavioral|technical| situational",
        "expectedPoints": ["key points to look for in answer"]
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw error;
  }
}

const geminiService = {
  generateContent,
  generateWithHistory,
  analyzeResume,
  generateInterviewFeedback,
  generateInterviewQuestions,
  createChatSession,
};

export default geminiService;
