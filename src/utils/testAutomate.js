import { getFunctions, httpsCallable } from "firebase/functions";
import getUserData from "./getUserData";

const functions = getFunctions();
const testAutomaticWeeklyRecap = httpsCallable(functions, "testAutomatic2");

const testAutomatic = async () => {
  const userData = await getUserData();
  const uid = userData.getUserId();

  console.log("Testing automatic weekly recap...");
  const result = await testAutomaticWeeklyRecap({ uid: uid });
  console.log(result);
};

export default testAutomatic;
