import axios from "axios";
import dotenv from "dotenv";
import { LLMConfig } from "../configs/llm.config";

dotenv.config();

class MistalWrapper {
  private static EndOfPromt = "End of prompt!";

  static async askAI(prompt: string, isDebug: boolean = false) {
    try {
      const fullPrompt = `${prompt} ${this.EndOfPromt}`;

      const response = await axios.post(
        `${LLMConfig.HUGGINGFACE_API_URL}/${LLMConfig.ANSWERS_MODEL_NAME}`,
        { inputs: fullPrompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedText =
        response.data?.[0]?.generated_text || "No response from AI.";
      const eorIndex = generatedText.indexOf(this.EndOfPromt);
      const finalText =
        eorIndex !== -1
          ? generatedText.substring(eorIndex + this.EndOfPromt.length).trim()
          : generatedText;

      return isDebug
        ? {
            answer:
              LLMConfig.ANSWERS_MODEL_NAME +
              "___" +
              response.data?.[0]?.generated_text,
          }
        : { answer: finalText };
    } catch (error) {
      console.error("Error in MistalWrapper.askAI:", error);
      return { answer: "Failed to process AI request" };
    }
  }
}

export default MistalWrapper;
