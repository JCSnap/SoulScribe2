import { getFunctions, httpsCallable } from "firebase/functions";
import getUserData from "./getUserData";
import setUserData from "./setUserData";

/**
 * Fetches the journal text for the specified start date and end date.
 * @param {Date} - date for the journal text.
 * @returns {Promise<string>} - The fetched journal text.
 */

const functions = getFunctions();

/**
 * Callable function to generate a summary using Firebase Cloud Functions.
 */
const generateDailySummary = httpsCallable(functions, "generateDailySummary");

/**
 * Creates and uploads a daily summary based on the fetched journal entry.
 * @param {Date} date - date for the daily summary.
 * @returns {Promise<void>}
 */
const createAndUploadDailySummary = async (date) => {
  // Fetch journal entry for the day
  const userDataGet = await getUserData();
  const entry = await userDataGet
    .getDailyJournalText(date)
    .then((result) => {
      console.log("finished getting user entry");
      return result;
    })
    .catch((error) => {
      console.error(error);
    });

  // Generate a summary using the generateSummary Firebase callable function
  let retries = 5;
  let summary;

  while (retries > 0) {
    try {
      const result = await generateDailySummary({ query: entry });
      const text = JSON.parse(result.data);
      console.log(text);
      summary = text;
      break;
    } catch (error) {
      console.error(error);
      retries--;
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds
      } else {
        throw new Error("Failed to generate summary after 5 attempts");
      }
    }
  }

  // Set the generated weekly summary in the user's data
  const userData = await setUserData();
  await userData.setDailySummary(date, summary);
};

export default createAndUploadDailySummary;
