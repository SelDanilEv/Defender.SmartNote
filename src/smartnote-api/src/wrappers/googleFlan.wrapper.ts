import axios from "axios";
import dotenv from "dotenv";
import { LLMConfig } from "../configs/llm.config";

dotenv.config();

class GoogleFlanWrapper {
  static Model = LLMConfig.CLASSIFICATION_MODEL_NAME;

  static async askAI(prompt: string, isDebug: boolean = false) {
    try{
      const response = await axios.post(
        `${LLMConfig.HUGGINGFACE_API_URL}/${this.Model}`,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const generatedText =
        response.data?.[0]?.generated_text || "No response from AI.";
  
      return isDebug
        ? {
            answer: this.Model + "___" + prompt + "___" + generatedText,
          }
        : { answer: generatedText };
    }
    catch(error){
      console.error("Error in GoogleFlanWrapper.askAI:", error);
      return { answer: "Failed to process AI request" };
    }
  }
}

export default GoogleFlanWrapper;
