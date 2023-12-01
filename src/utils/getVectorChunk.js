import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OPENAI_API_KEY, PINECONE_API_KEY } from "@env";
import { PineconeClient } from "@pinecone-database/pinecone";
import { getFunctions, httpsCallable } from "firebase/functions";

const getVectorChunk = async (question, userId) => {
  const functions = getFunctions();

  const getVectorChunks = httpsCallable(functions, "getVectorChunk");
  const stringDates = await getVectorChunks({ question });

  console.log(stringDates);
  console.log("Query successful");
  return stringDates;
};

export default getVectorChunk;
