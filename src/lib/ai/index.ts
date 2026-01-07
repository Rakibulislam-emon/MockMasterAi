import groqService from './groq';
import geminiService from './gemini';

/**
 * AI Gateway - Routes requests to appropriate AI provider
 * 
 * Strategy:
 * - Groq (Llama 3): Fast inference for real-time conversation
 * - Gemini Flash: Heavy lifting for analysis and feedback generation
 */

export interface AIProvider {
  name: string;
  generateContent: (prompt: string, options?: Record<string, unknown>) => Promise<string>;
  generateStreamingContent?: (prompt: string, onChunk: (chunk: string) => void, options?: Record<string, unknown>) => Promise<void>;
}

const providers: Record<string, AIProvider> = {
  groq: {
    name: 'Groq (Llama 3)',
    generateContent: groqService.generateContent,
    generateStreamingContent: groqService.generateStreamingContent,
  },
  gemini: {
    name: 'Gemini Flash',
    generateContent: geminiService.generateContent,
  },
};

/**
 * Gateway class to manage AI provider routing
 */
class AIGateway {
  private primaryProvider = 'groq';
  private fallbackProvider = 'gemini';
  
  /**
   * Generate content with automatic fallback
   * @param prompt - The prompt to send
   * @param options - Generation options
   * @returns The generated content
   */
  async generateContent(
    prompt: string,
    options: {
      provider?: string;
      preferFast?: boolean;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const providerName = options.provider || this.primaryProvider;
    const provider = providers[providerName];
    
    if (!provider) {
      throw new Error(`Unknown AI provider: ${providerName}`);
    }
    
    try {
      return await provider.generateContent(prompt, {
        preferFast: options.preferFast,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });
    } catch (error) {
      console.error(`Primary provider ${providerName} failed, falling back...`, error);
      
      // Try fallback provider
      const fallback = providers[this.fallbackProvider];
      if (fallback && fallback.name !== providerName) {
        return fallback.generateContent(prompt, options);
      }
      
      throw error;
    }
  }
  
  /**
   * Generate streaming content for real-time interaction
   * @param prompt - The prompt to send
   * @param onChunk - Callback for each chunk
   * @param options - Generation options
   */
  async generateStreamingContent(
    prompt: string,
    onChunk: (chunk: string) => void,
    options: {
      provider?: string;
      preferFast?: boolean;
      temperature?: number;
    } = {}
  ): Promise<void> {
    const providerName = options.provider || this.primaryProvider;
    const provider = providers[providerName];
    
    if (!provider?.generateStreamingContent) {
      // Fall back to non-streaming if provider doesn't support it
      const content = await this.generateContent(prompt, options);
      onChunk(content);
      return;
    }
    
    try {
      await provider.generateStreamingContent(prompt, onChunk, {
        preferFast: options.preferFast,
        temperature: options.temperature,
      });
    } catch (error) {
      console.error(`Streaming failed with ${providerName}, trying fallback...`, error);
      
      const fallback = providers[this.fallbackProvider];
      if (fallback?.generateStreamingContent) {
        await fallback.generateStreamingContent(prompt, onChunk, options);
      } else {
        // Final fallback to non-streaming
        const content = await this.generateContent(prompt, options);
        onChunk(content);
      }
    }
  }
  
  /**
   * Get the current primary provider name
   */
  getPrimaryProvider(): string {
    return this.primaryProvider;
  }
  
  /**
   * Check if a provider is available
   */
  async isProviderAvailable(providerName: string): Promise<boolean> {
    const provider = providers[providerName];
    if (!provider) return false;
    
    try {
      // Quick health check
      await provider.generateContent('Hello', { maxTokens: 5 });
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const aiGateway = new AIGateway();

// Export individual services for direct access
export { groqService, geminiService };

// Re-export all service functions for convenience
export const generateContent = (prompt: string, options?: Record<string, unknown>) => 
  aiGateway.generateContent(prompt, options);

export const generateStreamingContent = (
  prompt: string,
  onChunk: (chunk: string) => void,
  options?: Record<string, unknown>
) => aiGateway.generateStreamingContent(prompt, onChunk, options);
