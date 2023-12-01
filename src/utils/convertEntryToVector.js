import { getFunctions, httpsCallable } from "firebase/functions";
import getUserData from "./getUserData";
import setUserData from "./setUserData";

const functions = getFunctions();

const entryToVector = httpsCallable(functions, "entryToVector");

const convertEntryToVector = async (entry, date, userId) => {
  console.log(entry + " " + date);
  const data = {
    entry: entry + " " + date,
    date: date,
  };
  await entryToVector({ ...data, userId })
    .then((result) => {
      console.log("entryToVector successful");
    })
    .catch((error) => {
      console.error(error);
    });
};

export default convertEntryToVector;
