const functions = require("firebase-functions");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeClient } = require("@pinecone-database/pinecone");

const pineconeApiKey = functions.config().pinecone.key;

module.exports = functions.https.onCall(async (data, context) => {
  const entry = data.entry;
  const date = new Date(data.date);
  const userId = context.auth.uid;

  const stringDate = date.toISOString().split("T")[0];
  const client = new PineconeClient();
  await client.init({
    apiKey: pineconeApiKey,
    environment: "us-west1-gcp-free",
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: functions.config().openai.key,
  });

  // Embed the entry text into a query vector, append the date to the entry for extra information
  const entryVector = await embeddings.embedQuery(stringDate + "\n" + entry);
  console.log("finished embedding");

  // Get the Pinecone index
  const pineconeIndex = client.Index("soulscribe");
  console.log("got pinecone index");

  // Store the document in the Pinecone index
  await pineconeIndex.upsert({
    upsertRequest: {
      vectors: [
        {
          id: `${userId}_${stringDate}`,
          values: entryVector,
          metadata: { userId: userId, date: stringDate },
        },
      ],
    },
  });

  console.log(`Document stored in Pinecone index: ${userId}`);
});
