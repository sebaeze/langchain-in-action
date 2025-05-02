/*
*
*/
import "dotenv/config";
//
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
//
const templateCapital = new PromptTemplate({
    template: "Which is the capital of {country}?. In your output just send the city, no extra description is needed.",
    inputVariables:["country"]
})
const templateDescribeCity = new PromptTemplate({
    template: "Make a 20 words description of the city ${city}.",
    inputVariables:["city"]
})
//
const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL_LITE || "gemini-2.0-flash-lite",
    maxOutputTokens: 2048,
    temperature: parseFloat(process.env.DEFAULT_TEMPERATURE||"0.4")
});
//
console.log("....model.temperature: ",model.temperature,";");
//
const executePrompt = (country:string):Promise<string> => {
    return new Promise((resp,rech)=>{
        try {
            //
            templateCapital.format({country})
                .then((formatedPrompt:string)=>{
                    return model.invoke( formatedPrompt );
                })
                .then((responseCapitalCity:AIMessage)=>{
                    return templateDescribeCity.format({city:responseCapitalCity.content})
                })
                .then((formatedPrompt:string)=>{
                    return model.invoke( formatedPrompt );
                })
                .then((responseDescriptionCity:AIMessage)=>{
                    resp(responseDescriptionCity.content.toString())
                })
                .catch((errModel)=>{
                    rech(errModel);
                })
            //
        } catch(err){
            rech(err);
        }
    });
}
//
executePrompt("France")
    .then((dd:string)=>{
        console.log("...(A) dd: ",dd);
    })
    .catch((err)=>{
        console.log("**ERROR: ",err);
    })
//