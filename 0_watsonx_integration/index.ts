/*
*
*/
import "dotenv/config";
//
console.log("\n\n...api_key: ",process.env.GEMINI_API_KEY,"\n\n");
//
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.0-flash-lite",
    maxOutputTokens: 2048,
});
//
const executePrompt = async (prompt:string) => {
    return await model.invoke( prompt );
}
//
executePrompt("cual es la capital de francia?")
    .then((dd)=>{
        console.log("....dd: ",dd);
    })
    .catch((err)=>{
        console.log("**ERROR: ",err);
    })
//