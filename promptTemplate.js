import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import * as dotenv from "dotenv";
dotenv.config();
console.log("🔑 API Key Loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");

// Create model
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
});

// Create Prompt Template
//fromTemplate()
const prompt = ChatPromptTemplate.fromTemplate("You are a comedian. Tell a Joke based on the following word {input} ");

//console.log(await prompt.format({input: "chicken"}));

// Create Chain
const chain = prompt.pipe(model);

const response = await chain.invoke({
    input: "dog",
});

const prompt1 = ChatPromptTemplate.fromMessages([
    ["system", "Generate a joke based on a word provided by the user"],
    ["human","{input}"]
]);

const chain1 = prompt1.pipe(model);

const response1 = await chain1.invoke({
    input: "chicken",
});

console.log(response1.content)