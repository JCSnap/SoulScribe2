import { getFunctions, httpsCallable } from "firebase/functions";
import { INSTRUCTION } from "../constants/Replies";

/**
 * Sends the user question to the GPT API and gets a response
 * @param {String} userMessage - Start date for the journal text.
 * @returns {Promise<string>} - The response of the bot to the user question.
 */
const getAIAssistantResponse = async (userMessage) => {
  const functions = getFunctions();

  /**
   * Callable function to get response using Firebase Cloud Functions.
   */
  const generateResponse = httpsCallable(functions, "generateResponse");
  const response = await generateResponse({
    userMessage: userMessage,
    instruction: INSTRUCTION,
  });
  const text = JSON.parse(response.data);
  return text;
};

export default getAIAssistantResponse;
