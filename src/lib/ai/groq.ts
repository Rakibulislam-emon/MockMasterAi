import Groq from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Model configuration
const MODEL = 'llama-3.3-70b-versatile';
const FAST_MODEL = 'llama-3.1-8b-instant';

/**
 * Get the appropriate model based on complexity
 * @param preferFast - Whether to use the faster model
 */
function getModel(preferFast: boolean = false): string {
  return preferFast ? FAST_MODEL : MODEL;
}

/**
 * Generate content using Groq Llama 3
 * @param prompt - The prompt to send to the model
 * @param options - Additional generation options
 * @returns The generated text response
 */
export async function generateContent(
  prompt: string,
  options: {
    preferFast?: boolean;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  try {
    const model = getModel(options.preferFast);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide clear, concise, and helpful responses.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating content with Groq:', error);
    throw error;
  }
}

/**
 * Generate streaming response for real-time interaction
 * @param prompt - The prompt to send to the model
 * @param onChunk - Callback for each chunk of the response
 * @param options - Additional generation options
 */
export async function generateStreamingContent(
  prompt: string,
  onChunk: (chunk: string) => void,
  options: {
    preferFast?: boolean;
    temperature?: number;
  } = {}
): Promise<void> {
  try {
    const model = getModel(options.preferFast);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide clear, concise, and helpful responses.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model,
      temperature: options.temperature ?? 0.7,
      stream: true,
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error generating streaming content with Groq:', error);
    throw error;
  }
}

/**
 * Generate interview response with conversation context
 * @param history - Previous messages in the conversation
 * @param userResponse - The user's latest response
 * @param options - Additional generation options
 * @returns The AI's response
 */
export async function generateInterviewResponse(
  history: Array<{ role: string; content: string }>,
  userResponse: string,
  options: {
    preferFast?: boolean;
    language?: 'en' | 'bn' | 'mixed';
  } = {}
): Promise<string> {
  try {
    const model = getModel(options.preferFast);
    const languageInstruction =
      options.language === 'bn'
        ? 'Respond in Bengali (Bangla).'
        : options.language === 'mixed'
          ? 'You may mix Bengali and English as needed for clarification.'
          : 'Respond in English.';

    const systemPrompt = `You are a professional interview coach conducting a mock interview.
Your role is to:
1. Ask relevant interview questions based on the candidate's target role
2. Listen carefully to their responses
3. Ask follow-up questions when appropriate
4. Provide brief feedback when needed
5. Keep the conversation natural and professional
${languageInstruction}

Current conversation:
${history.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n')}

Candidate's latest response: ${userResponse}

Provide an appropriate response as the interviewer. Ask a follow-up question, move to a new topic, or provide brief feedback.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
      ],
      model,
      temperature: 0.8,
      max_tokens: 256,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating interview response:', error);
    throw error;
  }
}

/**
 * Analyze user response and provide quick feedback
 * @param question - The interview question asked
 * @param userResponse - The user's response
 * @returns Quick feedback on the response
 */
export async function analyzeResponse(
  question: string,
  userResponse: string
): Promise<{
  score: number;
  feedback: string;
  suggestions: string[];
}> {
  const prompt = `
    You are analyzing a job interview response.
    
    Question: ${question}
    
    Candidate's Response: ${userResponse}
    
    Provide quick feedback in JSON format:
    {
      "score": number (0-100) - overall quality score,
      "feedback": "brief one-sentence feedback",
      "suggestions": ["1-2 specific suggestions for improvement"]
    }
    
    Focus on:
    - Relevance to the question
    - Clarity and structure
    - Use of specific examples
    - Professional tone
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview coach providing quick feedback.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: FAST_MODEL,
      temperature: 0.5,
      max_tokens: 256,
    });

    const response = completion.choices[0]?.message?.content || '';
    const cleanedText = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error analyzing response:', error);
    throw error;
  }
}

/**
 * Check if a response is appropriate for the interview
 * @param response - The user's response to check
 * @returns Whether the response is appropriate
 */
export async function validateResponseAppropriateness(response: string): Promise<{
  isAppropriate: boolean;
  reason?: string;
}> {
  const prompt = `
    Check if the following interview response is appropriate and professional.
    
    Response: ${response}
    
    Return JSON:
    {
      "isAppropriate": boolean,
      "reason": "brief explanation if not appropriate"
    }
    
    Consider:
    - Professional tone
    - Relevance to interview context
    - No offensive or inappropriate content
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a content moderator for interview responses.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: FAST_MODEL,
      temperature: 0.3,
      max_tokens: 64,
    });

    const result = completion.choices[0]?.message?.content || '';
    const cleanedText = result.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error validating response:', error);
    // Default to appropriate if check fails
    return { isAppropriate: true };
  }
}

const groqDefaultService = {
  generateContent,
  generateStreamingContent,
  generateInterviewResponse,
  analyzeResponse,
  validateResponseAppropriateness,
};

export default groqDefaultService;

// Export as groqService for compatibility
export const groqService = {
  generateContent,
  generateStreamingContent,
  generateInterviewResponse,
  analyzeResponse,
  validateResponseAppropriateness,
};
