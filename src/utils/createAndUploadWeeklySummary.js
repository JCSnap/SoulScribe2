import { getFunctions, httpsCallable } from "firebase/functions";
import getUserData from "./getUserData";
import setUserData from "./setUserData";

/**
 * Fetches the journal text for the specified start date and end date.
 * @param {Date} startDate - Start date for the journal text.
 * @param {Date} endDate - End date for the journal text.
 * @returns {Promise<string>} - The fetched journal text.
 */
const fetchData = async (startDate, endDate) => {
  const userData = await getUserData();
  const journalText = await userData.getJournalText(startDate, endDate);
  return journalText;
};

const functions = getFunctions();

/**
 * Callable function to generate a summary using Firebase Cloud Functions.
 */
const generateSummary = httpsCallable(functions, "generateSummary");

/**
 * Creates and uploads a weekly summary based on the fetched journal entries.
 * @param {Date} startDate - Start date for the weekly summary.
 * @param {Date} endDate - End date for the weekly summary.
 * @returns {Promise<void>}
 */
const createAndUploadWeeklySummary = async (startDate, endDate) => {
  // Fetch journal entries for the specified start date and end date
  const entries = await fetchData(startDate, endDate)
    .then((result) => {
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
      const result = await generateSummary({ query: entries });
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
  await userData.setWeeklySummary(endDate, summary);
};

export default createAndUploadWeeklySummary;
