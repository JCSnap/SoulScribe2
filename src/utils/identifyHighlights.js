import { getFunctions, httpsCallable } from "firebase/functions";
import { setDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";
import { db } from "../backend/firebase/firebase";
import getUserData from "./getUserData";

// Get Firebase Cloud Functions
const functions = getFunctions();

// Get the 'identifyHighlights' callable function
const identifyHighlights = httpsCallable(functions, "identifyHighlights");

// Function to identify weekly highlights
const identifyWeeklyHighlights = async () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago
  const endDate = new Date(); // today

  // Get user data using the getUserData function
  const userData = await getUserData();

  // Get journal text for the specified date range
  const journalText = await userData.getJournalText(startDate, endDate);

  // Call the 'identifyHighlights' function with the journal text
  const highlights = await identifyHighlights(journalText).then((result) => {
    console.log(result);
    return result;
  });

  // Get the current user's UID
  const auth = getAuth();
  const uid = auth.currentUser.uid;

  // Format the end date of the week
  const endOfWeek = endDate.toISOString().split("T")[0]; // YYYY-MM-DD format

  // Create a reference to the document to store the weekly highlights
  const docRef = doc(
    db,
    "users",
    uid,
    "journal_highlight",
    `week_${endOfWeek}`
  );

  // Create a timestamp for the end date of the week
  const timestamp = Timestamp.fromDate(endDate); // Firebase timestamp, end of week

  // Set the document data with the highlights, end date, and duration
  await setDoc(docRef, {
    highlights: highlights,
    end_date: timestamp,
    duration: "week",
  });

  return highlights;
};

export default identifyWeeklyHighlights;
