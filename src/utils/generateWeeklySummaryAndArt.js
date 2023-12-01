import { getFunctions, httpsCallable } from "firebase/functions";
import { setDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";
import { db } from "../backend/firebase/firebase";
import getUserData from "./getUserData";

// Get the start and end dates for the week
const startDate = new Date();
startDate.setDate(startDate.getDate() - 7); // 7 days ago
const endDate = new Date(); // today

const fetchData = async () => {
  const userData = await getUserData();
  const journalText = await userData.getJournalText(startDate, endDate);

  return await createAndUploadWeeklySummary(journalText).then((result) => {
    console.log(result);
    return result;
  });
};

// Fetches user data and generates weekly summary
const createAndUploadWeeklySummary = async (query) => {
  return await generateSummary({ query })
    .then((result) => {
      const capture = JSON.parse(result.data);
      const text = capture.choices[0].message.content;
      return text;
    })
    .catch((error) => {
      console.error(error);
    });
};

// Generates weekly summary and artwork
const generateWeeklySummaryAndArt = async () => {
  const summary = await fetchData().then((result) => {
    return result;
  });

  // Identify highlights from the summary
  const highlights = await identifyHighlights({ query: summary })
    .then((result) => {
      console.log(result);
      const capture = JSON.parse(result.data);
      const text = capture.choices[0].message.content;
      return text;
    })
    .catch((error) => {
      console.error(error);
    });

  console.log(highlights);
  let finalHighlight = highlights
    .split("Final Highlight:")[1]
    .trim()
    .split("\n")[0];
  console.log(finalHighlight);

  console.log("starting art creation");
  data = {
    prompt: finalHighlight,
    model: "midjourney",
  };

  // Generate artwork based on the final highlight
  const image = await generateImage(data).then((result) => {
    const parsedResponse = JSON.parse(result.data);
    console.log(parsedResponse);
    const imageUrl = parsedResponse.output[0];
    console.log(imageUrl);
    return imageUrl;
  });

  const endOfWeek = endDate.toISOString().split("T")[0]; // YYYY-MM-DD format
  const docRef = doc(db, "users", uid, "journal_summary", `week_${endOfWeek}`);
  const timestamp = Timestamp.fromDate(endDate); // Firebase timestamp, end of week

  const userData = await getUserData();
  await userData.setWeeklySummaryAndArt(endDate, summary, highlights, image);
};

export default generateWeeklySummaryAndArt;
