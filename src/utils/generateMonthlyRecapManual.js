import createAndUploadMonthlySummary from "./createAndUploadMonthlySummary";
import createAndUploadSentence from "./createAndUploadSentence";
import createAndUploadArt from "./createAndUploadArt";
import getUserData from "./getUserData";

/**
 * Generates a weekly recap by creating and uploading the weekly summary, sentence, and art.
 */
const generateMonthlyRecapManual = async (endDate) => {
  // Calculate the start and end dates for the weekly recap

  // Retrieve the user data
  const userData = await getUserData();

  // Get the art style chosen by the user
  const artStyle = await userData.getStyle();

  // Create and upload the weekly summary
  await createAndUploadMonthlySummary(endDate);

  // Create and upload the sentence
  await createAndUploadSentence("month", endDate);

  // Create and upload the art
  await createAndUploadArt("month", endDate, artStyle);
};

export default generateMonthlyRecapManual;
