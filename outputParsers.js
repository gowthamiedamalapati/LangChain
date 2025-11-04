import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser, CommaSeparatedListOutputParser } from "@langchain/core/output_parsers"
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

import * as dotenv from "dotenv";
dotenv.config();
console.log("🔑 API Key Loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");

// Create model
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
});

async function callStringOutputParser(){
// Create Prompt
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Generate a joke based on a word provided by the user"],
    ["human","{input}"]
]);

const parser = new StringOutputParser();

// Create Chain
const chain = prompt.pipe(model).pipe(parser);

// Call Chain
return await chain.invoke({
    input: "chicken",
});
}

async function callListOutputParser(){
    const prompt = ChatPromptTemplate.fromTemplate(
        "Provide 5 synonyms, seperated by commas, for the following word {input}"
    );

    const outputparser = new CommaSeparatedListOutputParser();

    const chain = prompt.pipe(model).pipe(outputparser);

    return await chain.invoke({
        input: "happy",
    })
}

async function callStucturedParser() {
    const prompt = ChatPromptTemplate.fromTemplate(
        `Extract information from following phrase,
        Formatting Instructions: {format_instructions}
        Phrase: {phrase}`     
    );

    const structuredParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "the name of the person",
        age: "the age of the person",
    });

    const chain = prompt.pipe(model).pipe(structuredParser)

    return await chain.invoke({
         phrase: "Max is 30 years old",
         format_instructions: structuredParser.getFormatInstructions(),
    });    
}
async function callZodoutputParser() {
    const prompt = ChatPromptTemplate.fromTemplate(
        `Extract information from following phrase,
        Formatting Instructions: {format_instructions}
        Phrase: {phrase}`     
    );

    const outputParser = StructuredOutputParser.fromZodSchema(
        z.object({
            recipe: z.string().describe("name of the recipe"),
            ingredients: z.array(z.string()).describe("ingredients"),
        })
    );

    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        phrase: "The ingredients for a Spaghetti Bolognese recipe are tomatoes, minced beef, garlic, wine and herbs.",
        format_instructions: outputParser.getFormatInstructions(),
    });
}

// const response = await callStringOutputParser();
// const response = await callListOutputParser();
// const response = await callStucturedParser();
// const response = await callZodoutputParser();
// console.log(response)