const functions = require("firebase-functions");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");
const constants = require("./constants.js");
const entryToVector = require("./entryToVector.js");
const testAutomate = require("./automaticWeeklyRecap.js");
const testAutomate2 = require("./testAutomaticWeeklyRecap.js");
const admin = require("firebase-admin");
const { PubSub } = require("@google-cloud/pubsub");
const getVectorChunk = require("./getVectorChunk.js");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const pubSubClient = new PubSub();

const openaiApiKey = functions.config().openai.key;

exports.testFunction = functions.https.onCall((data, context) => {
  return "send, this is completed";
});

const corsHandler = cors({ origin: true });

const DEFAULT_MODEL = "gpt-3.5-turbo-0613";

const configuration = new Configuration({
  apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

// eslint-disable-next-line max-len
exports.openAIHttpFunction = functions.https.onCall(async (data, context) => {
  const params = data;

  if (!params.query) {
    return "Please Send Query Paramater";
  }

  const openAPIResponse = await openai.createCompletion({
    model: DEFAULT_MODEL,
    prompt: params?.query?.toString() || "Not Defined",
    max_tokens: 500,
    temperature: 0.7,
  });

  console.log(openAPIResponse.data);
  return JSON.stringify(openAPIResponse.data);
});

exports.openAIHttpFunction = functions.https.onCall(async (data, context) => {
  const params = data;

  if (!params.query) {
    return "Please Send Query Paramater";
  }

  const openAPIResponse = await openai.createChatCompletion({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: params?.query?.toString() || "Not Defined",
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  console.log(openAPIResponse.data);
  return JSON.stringify(openAPIResponse.data);
});

exports.generateSummary = functions.https.onCall(async (data, context) => {
  const params = data;
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

  if (!params.query) {
    return "Please Send Query Paramater";
  }

  const summaryObject = await openai.createChatCompletion({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: instruction,
      },
      {
        role: "user",
        content: params?.query?.toString(),
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const summary = summaryObject.data.choices[0].message.content;
  console.log(summary);
  return JSON.stringify(summary);
});

exports.generateMonthlySummary = functions.https.onCall(
  async (data, context) => {
    const params = data;
    const instruction = `
  You are a summary assistant.
  You will be given weekly summaries of a users' journal entries, sometimes in detail, sometimes not.
  Your goal is to create a monthly summary based on the weekly summaries.
  Write the summary in a second person perspective.
  Make the summary flow like a story - interesting and engaging, casual and friendly.
  Do not break down the entries into weeks since the entries might not be in order. Instead, focus on the week and make it flow naturally as a continuous narrative. 
  Focus on capturing the overall mood or feeling of the month, and highlight the experiences that seem the most impactful or meaningful to the user. 
  Remember, some events or activities can be omitted in order to maintain the flow and focus of the summary.
  `;

    if (!params.query) {
      return "Please Send Query Paramater";
    }

    const summaryObject = await openai.createChatCompletion({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: instruction,
        },
        {
          role: "user",
          content: params?.query?.toString(),
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const summary = summaryObject.data.choices[0].message.content;
    console.log(summary);
    return JSON.stringify(summary);
  }
);

exports.generateSentence = functions.https.onCall(async (data, context) => {
  const params = data;
  const instruction = `
  You are a summary assistant. 
  You will be given a summary of a journey entry, and your goal is to identify ONE biggest highlight from the summary and convert it into the following format:
  A man [doing something] in a [place]
  `;
  if (!params.query) {
    return "Please Send Query Paramater";
  }

  const sentenceObject = await openai.createChatCompletion({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: instruction,
      },
      {
        role: "user",
        content: params?.query?.toString(),
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const sentence = sentenceObject.data.choices[0].message.content;
  console.log(sentence);
  return JSON.stringify(sentence);
});

exports.generateResponse = functions.https.onCall(async (data, context) => {
  const params = data;
  if (!params.instruction || !params.userMessage) {
    return "Please Send instruction and user message Paramater";
  }

  const responseObject = await openai.createChatCompletion({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: params?.instruction?.toString(),
      },
      {
        role: "user",
        content: params?.userMessage?.toString(),
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const response = responseObject.data.choices[0].message.content;
  console.log(response);
  return JSON.stringify(response);
});

exports.identifyHighlights = functions.https.onCall(async (data, context) => {
  const params = data;

  if (!params.query) {
    return "Please Send Query Paramater";
  }

  const openAPIResponse = await openai.createChatCompletion({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: constants.IDENTIFY_HIGHLIGHTS_SYSTEM,
      },
      {
        role: "user",
        content: params?.query?.toString(),
      },
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  console.log(openAPIResponse.data);
  return JSON.stringify(openAPIResponse.data);
});

const fetch = require("node-fetch");

exports.generateArt = functions.https.onCall(async (data, context) => {
  // replace this with your actual key
  const stableDiffusionApiKey = functions.config().stablediffusion.key;
  const { prompt } = data;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: stableDiffusionApiKey,
      prompt: prompt,
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
    const response = await fetch(
      "https://stablediffusionapi.com/api/v3/text2img",
      requestOptions
    );
    const result = await response.text();
    console.log(result);
    return result;
  } catch (error) {
    console.log("error", error);
    return "An error occurred";
  }
});

exports.generateResponseFromPast = functions.https.onCall(
  async (data, context) => {
    const params = data;
    if (!params.context || !params.question) {
      return "Please Send context and question Paramater";
    }

    const instruction = `
  You are a recap assistant. You will be given some context about the user's past and a question by the user. Your goal is to answer the question based on the context.`;

    const prompt =
      "Context: " +
      params?.context?.toString() +
      "\n\nQuestion: " +
      params?.question?.toString();

    const responseObject = await openai.createChatCompletion({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: instruction,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = responseObject.data.choices[0].message.content;
    console.log(response);
    return JSON.stringify(response);
  }
);

// This function runs once a week and publishes user IDs to a Pub/Sub topic.
exports.scheduleGenerateRecap = functions.pubsub
  .schedule("every monday 00:00")
  .timeZone("Asia/Singapore")
  .onRun(async (context) => {
    const usersSnapshot = await db.collection("users").get();
    const promises = usersSnapshot.docs.map((doc) =>
      pubSubClient
        .topic("generate-weekly-recap")
        .publishMessage({ data: Buffer.from(JSON.stringify({ uid: doc.id })) })
    );
    await Promise.all(promises);
  });

exports.testScheduleGenerateRecap = functions.https.onCall(
  async (data, context) => {
    const usersSnapshot = await db.collection("users").get();
    const promises = usersSnapshot.docs.map((doc) =>
      pubSubClient
        .topic("generate-weekly-recap")
        .publishMessage({ data: Buffer.from(JSON.stringify({ uid: doc.id })) })
    );
    await Promise.all(promises);
    console.log("done");
  }
);

exports.entryToVector = entryToVector;

exports.testAutomate = testAutomate;

exports.testAutomate2 = testAutomate2;

exports.getVectorChunk = getVectorChunk;

// firebase functions:config:set openai.key="YOUR_NEW_API_KEY"

// to deploy to firebase cloud functions
// npm run deploy

// must cd into functions
