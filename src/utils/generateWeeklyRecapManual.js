import createAndUploadWeeklySummary from "./createAndUploadWeeklySummary";
import createAndUploadSentence from "./createAndUploadSentence";
import createAndUploadArt from "./createAndUploadArt";
import getUserData from "./getUserData";

/**
 * Generates a weekly recap by creating and uploading the weekly summary, sentence, and art.
 */
const generateWeeklyRecapManual = async (endDate) => {
  // Calculate the start and end dates for the weekly recap
  const startDate = new Date(endDate.getTime());
  startDate.setDate(endDate.getDate() - 7); // 7 days ago

  // Retrieve the user data
  const userData = await getUserData();

  // Get the art style chosen by the user
  const artStyle = await userData.getStyle();

  // Create and upload the weekly summary
  await createAndUploadWeeklySummary(startDate, endDate);

  // Create and upload the sentence
  await createAndUploadSentence("week", endDate);

  // Create and upload the art
  await createAndUploadArt("week", endDate, artStyle);
};

export default generateWeeklyRecapManual;
