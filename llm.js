import { ChatOpenAI } from "@langchain/openai";
import readline from "readline";
import * as dotenv from "dotenv";
dotenv.config();
console.log("🔑 API Key Loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function chatCompletion(text){
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
        apiKey: process.env.OPENAI_API_KEY, 
    });
    
    const response = await model.invoke(text);

    console.log("AI:", response.content);
}

function getPrompt(){
    rl.question("Enter your prompt: ", (input) => {
        if (input.toUpperCase() === "EXIT"){
            rl.close();
        } else {
            chatCompletion(input).then(() => getPrompt());
        }
    });
}

getPrompt();