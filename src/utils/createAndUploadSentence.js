import { getFunctions, httpsCallable } from "firebase/functions";
import getUserData from "./getUserData";
import setUserData from "./setUserData";

/**
 * Fetches the summary data for the specified duration and end date.
 * @param {string} duration - Duration of the data to fetch.
 * @param {Date} endDate - End date for the data.
 * @returns {Promise<string>} - The fetched summary data.
 */
const fetchData = async (duration, endDate) => {
  const userData = await getUserData();
  const Doc = await userData.getSummaryDoc(duration, endDate);
  return Doc.summary;
};

const functions = getFunctions();

/**
 * Callable function to generate a sentence using Firebase Cloud Functions.
 */
const generateSentence = httpsCallable(functions, "generateSentence");

/**
 * Creates and uploads a sentence based on the fetched summary data.
 * @param {string} duration - Duration of the data.
 * @param {Date} endDate - End date for the data.
 * @returns {Promise<void>}
 */
const createAndUploadSentence = async (duration, endDate) => {
  // Fetch summary data for the specified duration and end date
  const summary = await fetchData(duration, endDate)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
    });

  console.log("starting sentence generation");

  // Generate a sentence using the generateSentence Firebase callable function
  let retries = 5;
  let sentence;

  while (retries > 0) {
    try {
      const userData = await getUserData();
      const gender = await userData.getGender();
      const result = await generateSentence({ query: summary, gender: gender });
      const text = JSON.parse(result.data);
      console.log("sentence successfully generated");
      console.log(text);
      sentence = text;
      break;
    } catch (error) {
      console.error(error);
      retries--;
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds
      } else {
        throw new Error("Failed to generate sentence after 5 attempts");
      }
    }
  }

  // Set the generated sentence in the user's data
  const userData = await setUserData();
  await userData.setSentence(sentence, duration, endDate);
};

export default createAndUploadSentence;
