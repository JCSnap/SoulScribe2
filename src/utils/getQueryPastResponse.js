import getVectorChunk from "./getVectorChunk";
import getUserData from "./getUserData";
import { getFunctions, httpsCallable } from "firebase/functions";

const getQueryPastResponse = async (question, userId) => {
  const dateStrings = (await getVectorChunk(question, userId)).data;
  const userData = await getUserData();
  let combinedJournalText = "";

  for (let dateString of dateStrings) {
    const date = new Date(dateString);
    const journalText = await userData.getDailyJournalText(date);
    combinedJournalText += `[${dateString}]\n${journalText}\n\n`;
  }
  console.log(combinedJournalText);
  const functions = getFunctions();
  const generateResponseFromPast = httpsCallable(
    functions,
    "generateResponseFromPast"
  );
  let retries = 5;
  let response;

  while (retries > 0) {
    try {
      response = await generateResponseFromPast({
        context: combinedJournalText,
        question: question,
      });
      break;
    } catch (error) {
      console.error(error);
      retries--;
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds
      } else {
        throw new Error(
          "Failed to generate response from past after 5 attempts"
        );
      }
    }
  }

  const text = JSON.parse(response.data);
  console.log(text);
  return text;
};

export default getQueryPastResponse;
