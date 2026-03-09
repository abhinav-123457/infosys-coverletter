export interface PolishCoverLetterInput {
  draftLetter: string;
  jobDescription: string;
  resumeSkills: string[];
}

export interface PolishCoverLetterOutput {
  polishedLetter: string;
  success: boolean;
  error?: string;
}

/**
 * LLM-based cover letter polishing module
 * Improves grammar, tone, and professional quality while maintaining factual accuracy
 */
export async function polishCoverLetter({
  draftLetter,
  jobDescription,
  resumeSkills
}: PolishCoverLetterInput): Promise<PolishCoverLetterOutput> {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return {
        polishedLetter: draftLetter,
        success: false,
        error: 'API key not configured'
      };
    }

    const systemPrompt = `You are a professional cover letter editor. Your task is to improve a draft cover letter while maintaining factual accuracy.

RULES:
1. Improve grammar, tone, and professional quality
2. Maintain the original meaning and factual content
3. Use the job description to slightly align wording with the role
4. Frame transferable skills when candidate skills differ from job requirements
5. DO NOT add experiences, skills, or achievements not present in the resume
6. DO NOT hallucinate or fabricate new skills
7. Keep approximately the same length
8. Maintain professional tone suitable for job applications

CANDIDATE SKILLS: ${resumeSkills.join(', ')}

JOB DESCRIPTION: ${jobDescription}

DRAFT COVER LETTER:
${draftLetter}

Return ONLY the polished cover letter text. No explanations or additional text.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Cover Letter Polisher'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: 'Please polish this cover letter according to the instructions.'
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const polishedLetter = data.choices?.[0]?.message?.content?.trim();

    if (!polishedLetter) {
      throw new Error('No polished content received from API');
    }

    return {
      polishedLetter,
      success: true
    };

  } catch (error) {
    return {
      polishedLetter: draftLetter,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
