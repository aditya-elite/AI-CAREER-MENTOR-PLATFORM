import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Assessment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateAssessment = async (
  profile: UserProfile,
  topic: string,
  teachingTranscript: string,
  doubtTranscript: string
): Promise<Assessment> => {
  const prompt = `
    You are a student in ${profile.standard} standard under the ${profile.board} board.
    Your teacher, ${profile.name}, just explained the topic: "${topic}".
    
    Here is the transcript of their initial explanation:
    "${teachingTranscript}"
    
    After the explanation, you asked some doubts and the teacher clarified them.
    Here is the transcript of the doubt-clearing session:
    "${doubtTranscript}"
    
    As a student, evaluate their overall teaching. 
    1. Rate their understanding from 1 to 10.
    2. Provide constructive feedback.
    3. Identify any critical points they might have missed for a student of your level, even after the doubt session.
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          missingPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["rating", "feedback", "missingPoints"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const askDoubt = async (
  profile: UserProfile,
  topic: string,
  transcript: string,
  previousDoubts: string[]
): Promise<string> => {
  const prompt = `
    You are a curious student in ${profile.standard} standard (${profile.board} board).
    Your teacher (${profile.name}) explained "${topic}":
    "${transcript}"
    
    Ask a thoughtful "doubt" or question that a student might have. 
    The goal is to see if the teacher truly understands the nuances or to clarify something that was slightly vague.
    Don't repeat these previous questions: ${previousDoubts.join(", ")}.
    Keep it natural, like a real student.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "Can you explain that part again?";
};
