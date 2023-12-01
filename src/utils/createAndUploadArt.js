import { getFunctions, httpsCallable } from "firebase/functions";
import getUserData from "./getUserData";
import setUserData from "./setUserData";
import { ART_STYLES } from "../constants/Shop";

/**
 * Fetches data for the specified duration and end date.
 * @param {string} duration - Duration of the data to fetch.
 * @param {Date} endDate - End date for the data.
 * @returns {Promise<string>} - The fetched data.
 */
const fetchData = async (duration, endDate) => {
  const userData = await getUserData();
  const Doc = await userData.getSummaryDoc(duration, endDate);
  return Doc.sentence;
};

const functions = getFunctions();

/**
 * Callable function to generate art using Firebase Cloud Functions.
 */
const generateArt = httpsCallable(functions, "generateArt");

/**
 * Creates and uploads art based on the fetched data.
 * @param {string} duration - Duration of the data.
 * @param {Date} endDate - End date for the data.
 * @param {string} artStyle - Style of the art to generate.
 * @returns {Promise<void>}
 */
const createAndUploadArt = async (duration, endDate, artStyle) => {
  // Fetch data for the specified duration and end date
  const sentence = await fetchData(duration, endDate)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
    });

  // Prepare the art prompt by combining the fetched sentence and art style prompt
  const artPrompt = sentence + ", " + ART_STYLES[artStyle].prompt;

  // Generate art using the generateArt Firebase callable function
  let retries = 5;
  let art;

  while (retries > 0) {
    try {
      const result = await generateArt({ prompt: artPrompt });
      const artObject = JSON.parse(result.data);
      art = artObject.output[0];
      console.log(art);
      break;
    } catch (error) {
      console.error(error);
      retries--;
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds
      } else {
        throw new Error("Failed to generate art after 5 attempts");
      }
    }
  }

  // Set the generated art in the user's data
  const userData = await setUserData();
  await userData.setArt(art, duration, endDate);
};

export default createAndUploadArt;
