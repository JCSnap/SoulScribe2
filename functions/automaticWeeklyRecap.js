const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");
const { Configuration, OpenAIApi } = require("openai");
const { ART_STYLES } = require("./constants");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const openaiApiKey = functions.config().openai.key;
const configuration = new Configuration({
  apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);
const DEFAULT_MODEL = "gpt-3.5-turbo";

const getJournalText = async (startDate, endDate, uid) => {
  // Get a reference to the user's journal entries
  const journalCollectionRef = db.collection(`users/${uid}/journals`);
  console.log("Successfully gotten journal entries");
  // Create a query against the collection.
  const snapshot = await journalCollectionRef
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date")
    .get();

  let journalText = "";
  snapshot.forEach((doc) => {
    if (doc.exists) {
      journalText += doc.data().text + "\n";
    } else {
      console.log("No such document!");
    }
  });
  console.log("Combined journal entries: " + journalText);
  return journalText;
};

const generateSummaryHelper = async (entries) => {
  const instruction = `
You are a summary assistant.
You will be given journal entries from a user, sometimes in detail, sometimes not.
Your goal is to summarise the entries into a few sentences.
Write the summary in a second person perspective.
Make the summary flow like a story - interesting and engaging, casual and friendly.
Do not break down the entries into days since the entries might not be in order. Instead, focus on the week and make it flow naturally as a continuous narrative. 
Focus on capturing the overall mood or feeling of the week, and highlight the experiences that seem the most impactful or meaningful to the user. 
Remember, some events or activities can be omitted in order to maintain the flow and focus of the summary.
`;

  console.log("Generating summary...");
  const summaryObject = await openai.createChatCompletion({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: instruction,
      },
      {
        role: "user",
        content: entries,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const summary = summaryObject.data.choices[0].message.content;
  console.log("Successfully generated summary: " + summary);
  return summary;
};

const generateSentenceHelper = async (summary, gender) => {
  const instruction = `
  You are a summary assistant. 
  You will be given a summary of a journey entry, and your goal is to identify ONE biggest highlight from the summary and convert it into the following format:
  A ${gender} [doing something] in a [place]
  `;

  console.log("Generating sentence...");
  const sentenceObject = await openai.createChatCompletion({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: instruction,
      },
      {
        role: "user",
        content: summary,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const sentence = sentenceObject.data.choices[0].message.content;
  console.log("Successfully generated sentence: " + sentence);
  return sentence;
};

const generateArtHelper = async (artPrompt) => {
  const stableDiffusionApiKey = functions.config().stablediffusion.key;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: stableDiffusionApiKey,
      prompt: artPrompt,
      negative_prompt: null,
      width: "512",
      height: "512",
      samples: "1",
      num_inference_steps: "20",
      seed: null,
      guidance_scale: 7.5,
      safety_checker: "yes",
      multi_lingual: "no",
      panorama: "no",
      self_attention: "no",
      upscale: "no",
      webhook: null,
      track_id: null,
    }),
  };

  try {
    console.log("Generating art...");
    const response = await fetch(
      "https://stablediffusionapi.com/api/v3/text2img",
      requestOptions
    );
    console.log("Successfully generated art");
    console.log(response);
    console.log("Converting to text");
    const result = await response.text();
    console.log("Parsing");
    const parsed = JSON.parse(result);
    console.log(parsed);
    console.log(parsed.output[0]);
    return parsed.output[0];
  } catch (error) {
    console.log("error", error);
    return "An error occurred";
  }
};

const setWeeklySummary = async (uid, endDate, summary) => {
  const endOfWeek = endDate.toISOString().split("T")[0];
  const docRef = db.doc(`users/${uid}/journal_summary/week_${endOfWeek}`);
  const timestamp = admin.firestore.Timestamp.fromDate(endDate);
  await docRef.set({
    summary: summary,
    end_date: timestamp,
    duration: "week",
  });
  return summary;
};

module.exports = functions.pubsub
  .topic("generate-weekly-recap")
  .onPublish(async (message) => {
    // Decode the base64 message data
    const dataString = Buffer.from(message.data, "base64").toString();
    console.log("Data string: ", dataString);

    // Check if the data string is valid JSON
    try {
      JSON.parse(dataString);
    } catch (e) {
      console.error("Invalid JSON string: ", e);
      return;
    }

    const uid = JSON.parse(dataString).uid;
    console.log("uid: " + uid);
    // Call generateRecap for this user...
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 days ago
    const endDate = new Date();
    const weeklyEntries = await getJournalText(startDate, endDate, uid);

    // Generate a summary using the generateSummaryHelper function
    let retries = 5;
    let summary;

    while (retries > 0) {
      try {
        summary = await generateSummaryHelper(weeklyEntries);
        console.log(summary);
        break;
      } catch (error) {
        console.error(error);
        retries--;
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds
        } else {
          throw new Error("Failed to generate summary after 5 attempts");
        }
      }
    }

    await setWeeklySummary(uid, endDate, summary);
    const duration = "week";
    const dateString = endDate.toISOString().split("T")[0];
    const docId = `${duration}_${dateString}`;
    const summaryDocRef = db.doc(`users/${uid}/journal_summary/${docId}`);

    // Get the user's gender
    const userDocRef = db.doc(`users/${uid}`);
    const userDoc = await userDocRef.get();
    const gender = userDoc.data().gender;

    // Generate a sentence using OpenAI or another API
    // Note: This will depend on your actual implementation
    let sentence;
    retries = 5;
    while (retries > 0) {
      try {
        sentence = await generateSentenceHelper(summary, gender);
        break;
      } catch (error) {
        console.error(error);
        retries--;
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          throw new Error("Failed to generate sentence after 5 attempts");
        }
      }
    }

    // Save the generated sentence
    await summaryDocRef.set({ sentence: sentence }, { merge: true });

    const artStyle = userDoc.data().art_style || "postGrunge";
    const artPrompt = sentence + ", " + ART_STYLES[artStyle].prompt;
    console.log("Art prompt: " + artPrompt);
    let art;
    retries = 5;
    while (retries > 0) {
      try {
        art = await generateArtHelper(artPrompt);
        break;
      } catch (error) {
        console.error(error);
        retries--;
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          throw new Error("Failed to generate art after 5 attempts");
        }
      }
    }
    await summaryDocRef.set({ art: art }, { merge: true });
  });
