import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../backend/firebase/firebase";

const getUserData = async () => {
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // The document does not exist
    console.log("No such document!");
    return null;
  }

  // The document exists
  const userData = userDocSnap.data();

  const getJournalText = async (startDate, endDate) => {
    // Get a reference to the user's journal entries
    const journalCollectionRef = collection(doc(db, "users", uid), "journals");

    // Create a query against the collection.
    const q = query(
      journalCollectionRef,
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date")
    );

    const querySnapshot = await getDocs(q);
    let journalText = "";
    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        journalText += doc.data().text + "\n";
      } else {
        console.log("No such document!");
      }
    });

    return journalText;
  };

  const getWeeklySummariesText = async (date) => {
    // Get a reference to the user's summaries
    const summaryCollectionRef = collection(
      doc(db, "users", uid),
      "journal_summary"
    );

    // Get the first day of the given month
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);

    // Get the first day of the next month
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // Create a query against the collection.
    const q = query(
      summaryCollectionRef,
      where("end_date", ">=", startDate),
      where("end_date", "<", endDate),
      where("duration", "==", "week"),
      orderBy("end_date")
    );

    const querySnapshot = await getDocs(q);
    let summariesText = "";
    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        summariesText += doc.data().summary + "\n";
      } else {
        console.log("No such document!");
      }
    });

    return summariesText;
  };

  const getDailyJournalText = async (date) => {
    const dateString = date.toISOString().split("T")[0]; // Format the date as a string in the format 'yyyy-mm-dd'

    // Get a reference to the user's specific journal entry
    const journalDocRef = doc(db, "users", uid, "journals", dateString);

    const docSnapshot = await getDoc(journalDocRef);
    let journalText = "";

    if (docSnapshot.exists()) {
      journalText = docSnapshot.data().text;
    } else {
      console.log("No such document!");
    }

    return journalText;
  };

  const getSummaryDoc = async (duration, specificDate) => {
    // Create a unique identifier for each day's entry
    const dateString = specificDate.toISOString().split("T")[0];
    // Create the document ID
    const docId = `${duration}_${dateString}`;
    // Get a reference to the specific document
    const summaryDocRef = doc(db, "users", uid, "journal_summary", docId);

    // Get the document data
    const docSnap = await getDoc(summaryDocRef);

    let documentData = null;

    if (docSnap.exists()) {
      // If the document exists, get its data
      documentData = docSnap.data();
    } else {
      console.log("No such document!");
    }

    return documentData;
  };

  const getWeeklyArtsAndSummaries = async (startDate, endDate) => {
    // Get a reference to the user's weekly summaries
    const weekSummaryCollectionRef = collection(
      doc(db, "users", uid),
      "journal_summary"
    );

    // Create a query against the collection.
    const q = query(
      weekSummaryCollectionRef,
      where("end_date", ">=", startDate),
      where("end_date", "<=", endDate),
      where("duration", "==", "week"),
      orderBy("end_date", "desc")
    );

    const querySnapshot = await getDocs(q);
    let weeklySummariesAndArt = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        const data = doc.data();
        weeklySummariesAndArt.push({
          endDate: data.end_date,
          art: data.art,
          summary: data.summary,
        });
      } else {
        console.log("No such document!");
      }
    });

    return weeklySummariesAndArt;
  };

  const getMonthlyArtsAndSummaries = async (startDate, endDate) => {
    // Get a reference to the user's monthly summaries
    const monthSummaryCollectionRef = collection(
      doc(db, "users", uid),
      "journal_summary"
    );

    // Create a query against the collection.
    const q = query(
      monthSummaryCollectionRef,
      where("end_date", ">=", startDate),
      where("end_date", "<=", endDate),
      where("duration", "==", "month"),
      orderBy("end_date", "desc")
    );

    console.log("queried");

    const querySnapshot = await getDocs(q);
    let monthlySummariesAndArt = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        const data = doc.data();
        monthlySummariesAndArt.push({
          endDate: data.end_date,
          art: data.art,
          summary: data.summary,
        });
      } else {
        console.log("No such document!");
      }
    });

    return monthlySummariesAndArt;
  };

  const getUserDocRef = () => {
    return userDocRef;
  };

  const getEntryDocSnap = async (date) => {
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split("T")[0];
    const docRef = doc(db, "users", uid, "journals", dateStr);
    const docSnap = await getDoc(docRef);
    return docSnap;
  };

  const getDatesWithEntry = async () => {
    const docRef = doc(db, "users", uid, "journals", "dates_with_entry");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const docData = docSnap.data();
      const dateArray = docData.dates.split(" ");
      console.log("dates returning successfully");
      return dateArray;
    } else {
      console.log("returning nothing");
      return [];
    }
  };

  const getBackgroundColour = async () => {
    if (userData.getBoolean("bg_colour") != null) {
      return userData.bg_colour;
    } else {
      await docRef.set(
        {
          bg_colour: "bg-fuchsia-50",
        },
        { merge: true }
      );
      return bg - fuchsia - 50;
    }
  };

  return {
    getEmail: () => userData.email,
    getUserId: () => userData.uid,
    getCoins: () => userData.coins,
    getHomeCharacter: () => userData.home_character,
    getHomePet: () => userData.home_pet,
    getEntries: () => userData.entries,
    getCharactersUnlocked: () => userData.characters_unlocked,
    getPetsUnlocked: () => userData.pets_unlocked,
    getArtsUnlocked: () => userData.arts_unlocked,
    getStyle: () => userData.style,
    getLastJournalDate: () => userData.last_journal_date,
    getConsecutiveDays: () => userData.consecutive_days,
    getFeedback: () => userData.feedback,
    getUsername: () => userData.username,
    getIsFirstTine: () => userData.is_first_time,
    getGender: () => userData.gender,
    getJournalText: getJournalText,
    getWeeklySummariesText: getWeeklySummariesText,
    getDailyJournalText: getDailyJournalText,
    getSummaryDoc: getSummaryDoc,
    getWeeklyArtsAndSummaries: getWeeklyArtsAndSummaries,
    getMonthlyArtsAndSummaries: getMonthlyArtsAndSummaries,
    getUserDocRef: getUserDocRef,
    getEntryDocSnap: getEntryDocSnap,
    getDatesWithEntry: getDatesWithEntry,
    getBackgroundColour: getBackgroundColour,
    // Add more getters as needed...
  };
};

export default getUserData;
