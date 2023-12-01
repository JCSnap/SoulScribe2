import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OPENAI_API_KEY } from "@env";

const Langchain = async () => {
  const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.7 });
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });
  const res = await embeddings.embedQuery("I am happy");
  console.log(res);
};

export default Langchain;
