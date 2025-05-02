/*
*
*/
import "dotenv/config";
//
import { Ollama } from "@langchain/ollama";
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
const model = new Ollama({
    model: process.env.DEFAULT_OLLAMA_MODEL || "gemma3:1b",
    temperature: parseFloat(process.env.DEFAULT_TEMPERATURE||"0.4"),
    maxRetries: 2
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
                .then((responseCapitalCity:string)=>{
                    return templateDescribeCity.format({city:responseCapitalCity})
                })
                .then((formatedPrompt:string)=>{
                    return model.invoke( formatedPrompt );
                })
                .then((responseDescriptionCity:string)=>{
                    resp(responseDescriptionCity)
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