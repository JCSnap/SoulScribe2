const functions = require("firebase-functions");
const { PineconeClient } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const OPENAI_API_KEY = functions.config().openai.key;
const PINECONE_API_KEY = functions.config().pinecone.key;

module.exports = functions.https.onCall(async (data, context) => {
  const userId = context.auth.uid; // use Firebase Authentication
  const question = data.question;

  const client = new PineconeClient();
  await client.init({
    apiKey: PINECONE_API_KEY,
    environment: "us-west1-gcp-free",
  });

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });

  const questionVector = await embeddings.embedQuery(question);

  const pineconeIndex = client.Index("soulscribe");

  const queryResponse = await pineconeIndex.query({
    queryRequest: {
      vector: questionVector,
      topK: 3, // Change this to the number of dates you want to return
      filters: {
        userId: { $eq: userId },
      },
      includeMetadata: true,
    },
  });

  const stringDates = queryResponse.matches.map((match) => {
    const id = match.id;
    const parts = id.split("_");
    const stringDate = parts[1];
    return stringDate;
  });

  return stringDates;
});
