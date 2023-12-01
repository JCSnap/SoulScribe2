import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../backend/firebase/firebase";
import { arrayUnion } from "firebase/firestore";
import getUserData from "./getUserData";

// Function to set user data
const setUserData = async () => {
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  const userRef = doc(db, "users", uid);

  // Function to set the user's art style
  const setArtStyle = async (artTitle) => {
    console.log("Setting art style to: " + artTitle);
    await setDoc(userRef, { style: artTitle }, { merge: true });
  };

  // Function to set the user's journal entry for the current day
  const setJournalEntry = async (newEntry) => {
    // Create a unique identifier for each day's entry
    const dateString = newEntry.date.toISOString().split("T")[0];
    const entryRef = doc(db, `users/${uid}/journals`, dateString);
    const docSnap = await getDoc(entryRef);

    // If the document exists or not, set it
    await setDoc(entryRef, newEntry, { merge: true });
  };

  // Function to set the user's home item (character or pet)
  const setHomeItem = async (item) => {
    if (item.type === "character") {
      const home_character = "home_character";
      await updateDoc(userDocRef, { [home_character]: item.id });
    } else {
      const home_pet = "home_pet";
      await updateDoc(userDocRef, { [home_pet]: item.id });
    }
  };

  // Function to set the user's weekly summary
  const setWeeklySummary = async (endDate, summary) => {
    const endOfWeek = endDate.toISOString().split("T")[0];
    const docRef = doc(
      db,
      "users",
      uid,
      "journal_summary",
      `week_${endOfWeek}`
    );
    const timestamp = Timestamp.fromDate(endDate);
    await setDoc(docRef, {
      summary: summary,
      end_date: timestamp,
      duration: "week",
    });
    return summary;
  };

  const setMonthlySummary = async (endDate, summary) => {
    const endOfWeek = endDate.toISOString().split("T")[0];
    const docRef = doc(
      db,
      "users",
      uid,
      "journal_summary",
      `month_${endOfWeek}`
    );
    const timestamp = Timestamp.fromDate(endDate);
    await setDoc(docRef, {
      summary: summary,
      end_date: timestamp,
      duration: "month",
    });
    return summary;
  };

  // Function to set the user's weekly summary
  const setDailySummary = async (date, summary) => {
    const endOfDay = date.toISOString().split("T")[0];
    const docRef = doc(db, "users", uid, "journal_summary", `day_${endOfDay}`);
    const timestamp = Timestamp.fromDate(date);
    await setDoc(docRef, {
      summary: summary,
      end_date: timestamp,
      duration: "day",
    });
    return summary;
  };

  // Function to set a sentence for a specific duration and date
  const setSentence = async (sentence, duration, date) => {
    const endDate = date.toISOString().split("T")[0];
    const docId = `${duration}_${endDate}`;
    const docRef = doc(db, "users", uid, "journal_summary", docId);
    await setDoc(docRef, { sentence: sentence }, { merge: true });
  };

  // Function to set an art for a specific duration and date
  const setArt = async (art, duration, date) => {
    const endDate = date.toISOString().split("T")[0];
    const docId = `${duration}_${endDate}`;
    const docRef = doc(db, "users", uid, "journal_summary", docId);
    await setDoc(docRef, { art: art }, { merge: true });
  };

  // Function to set the user's home character
  const setHomeCharacter = async (characterId) => {
    await updateDoc(userRef, { home_character: characterId });
  };

  // Function to set the user's home pet
  const setHomePet = async (petId) => {
    await updateDoc(userRef, { home_pet: petId });
  };

  // Function to add a character to the unlocked characters array
  const addCharactersUnlocked = async (characterId) => {
    await updateDoc(userRef, {
      characters_unlocked: arrayUnion(characterId),
    });
  };

  // Function to add a pet to the unlocked pets array
  const addPetsUnlocked = async (petId) => {
    await updateDoc(userRef, {
      pets_unlocked: arrayUnion(petId),
    });
  };

  // Function to add an art to the unlocked arts array
  const addArtsUnlocked = async (artId) => {
    await updateDoc(userRef, {
      arts_unlocked: arrayUnion(artId),
    });
  };

  // Function to set the user's username
  const setUsername = async (username) => {
    await setDoc(userRef, { username: username }, { merge: true });
  };

  // Function to set the user's gender
  const setGender = async (gender) => {
    console.log("setting gender");
    await setDoc(userRef, { gender: gender }, { merge: true });
  };

  // Function to check if this is the first time the user is using the app
  const setFirstTime = async (firstTime) => {
    await setDoc(userRef, { is_first_time: firstTime }, { merge: true });
  };

  // Function to deduct coins from the user's balance
  const deductCoins = async (cost) => {
    const userData = await getUserData();
    const coins = userData.getCoins();
    await updateDoc(userRef, {
      coins: coins - cost,
    });
  };

  // Function to add coins to the user's balance
  const addCoins = async (coinsEarned) => {
    const userData = await getUserData();
    const coins = userData.getCoins();
    await updateDoc(userRef, {
      coins: coins + coinsEarned,
    });
  };

  // Function to update the user's consecutive days
  const updateConsecutiveDays = async (newConsecutiveDays) => {
    await updateDoc(userRef, {
      consecutive_days: newConsecutiveDays,
    });
  };

  // Function to update the user's last journal date
  const updateLastJournalDate = async (date) => {
    await updateDoc(userRef, {
      last_journal_date: date,
    });
  };

  // Function to update the user's entries
  const updateEntries = async () => {
    const userDataGet = await getUserData();
    const oldEntries = userDataGet.getEntries();
    await updateDoc(userRef, {
      entries: oldEntries + 1,
    });
  };

  // Function to update the user's feedback
  const updateFeedback = async (feedback) => {
    await updateDoc(userRef, {
      feedback: feedback,
    });
  };

  const updateDatesWithEntry = async (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const docRef = doc(db, "users", uid, "journals", "dates_with_entry");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      console.log(docData.dates);
      const newDates = docData.dates + " " + dateStr;
      await setDoc(docRef, { dates: newDates }, { merge: true });
    } else {
      await setDoc(docRef, { dates: dateStr }, { merge: true });
    }
  };

  return {
    setArtStyle: setArtStyle,
    setJournalEntry: setJournalEntry,
    setHomeItem: setHomeItem,
    setMonthlySummary: setMonthlySummary,
    setWeeklySummary: setWeeklySummary,
    setDailySummary: setDailySummary,
    setSentence: setSentence,
    setArt: setArt,
    setHomeCharacter: setHomeCharacter,
    setHomePet: setHomePet,
    addCharactersUnlocked: addCharactersUnlocked,
    addPetsUnlocked: addPetsUnlocked,
    addArtsUnlocked: addArtsUnlocked,
    setUsername: setUsername,
    setGender: setGender,
    setFirstTime: setFirstTime,
    deductCoins: deductCoins,
    addCoins: addCoins,
    updateConsecutiveDays: updateConsecutiveDays,
    updateLastJournalDate: updateLastJournalDate,
    updateEntries: updateEntries,
    updateFeedback: updateFeedback,
    updateDatesWithEntry: updateDatesWithEntry,
    // Add more setters as needed...
  };
};

export default setUserData;
