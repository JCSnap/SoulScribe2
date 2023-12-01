import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const testScheduleGenerateRecap = httpsCallable(
  functions,
  "testScheduleGenerateRecap"
);

const testSchedule = async () => {
  console.log("Testing automatic weekly recap...");
  await testScheduleGenerateRecap({});
};

export default testSchedule;
