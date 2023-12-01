import { getFunctions, httpsCallable } from "firebase/functions";
import getUserData from "./getUserData";
import setUserData from "./setUserData";

/**
 * Fetches the journal text for the month of the specified date.
 * @param {Date} endDate - End date for the journal text.
 * @returns {Promise<string>} - The fetched journal text.
 */
const fetchData = async (date) => {
  const userData = await getUserData();
  const journalText = await userData.getWeeklySummariesText(date);
  return journalText;
};

const functions = getFunctions();

/**
 * Callable function to generate a summary using Firebase Cloud Functions.
 */
const generateMonthlySummary = httpsCallable(
  functions,
  "generateMonthlySummary"
);

/**
 * Creates and uploads a monthly summary based on the fetched journal entries.
 * @param {Date} date - End date for the monthly summary.
 * @returns {Promise<void>}
 */
const createAndUploadMonthlySummary = async (date) => {
  // Fetch journal entries for the month of the date
  const entries = await fetchData(date)
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
      const result = await generateMonthlySummary({ query: entries });
      const text = JSON.parse(result.data);
      console.log(text);
      summary = text;
      break;
    } catch (error) {
      console.error(error);
      retries--;
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        throw new Error("Failed to generate summary after 5 attempts");
      }
    }
  }

  // Set the generated monthly summary in the user's data
  const userData = await setUserData();
  await userData.setMonthlySummary(date, summary);
};

export default createAndUploadMonthlySummary;
