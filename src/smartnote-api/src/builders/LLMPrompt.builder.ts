class LLMPromptBuilder {
  private prompt: string;

  private constructor(base?: string) {
    this.prompt = base || "You are a notes app assistant called SmartNote. ";
  }

  static init(base?: string): LLMPromptBuilder {
    return new LLMPromptBuilder(base);
  }

  addCurrentDate(): LLMPromptBuilder {
    const currentDate = new Date().toDateString();
    this.prompt += `Today is ${currentDate}. `;
    return this;
  }

  addUserRequest(userRequest: string): LLMPromptBuilder {
    if (!/[.!?]$/.test(userRequest)) {
      userRequest += ".";
    }
    this.prompt += `User's request: ${userRequest} `;
    return this;
  }

  addCustomInstruction(instruction: string): LLMPromptBuilder {
    this.prompt += `${instruction} `;
    return this;
  }

  addUserResponseHints(): LLMPromptBuilder {
    this.prompt +=
      "Respond directly, human readable, and briefly. Hide unrelated details. ";
    return this;
  }

  addNotesSummary(notesSummary: string): LLMPromptBuilder {
    this.prompt += `User's notes: ${notesSummary}. `;
    return this;
  }

  addClassificationPrompt(classificationDict: {
    [resultClass: string]: string;
  }): LLMPromptBuilder {
    // Construct classification instructions:
    // - We emphasize that the output MUST BE exactly one word (the class).
    // - We provide the condition->class mapping in a readable format.

    const possibleClasses = Object.keys(classificationDict)
      .map((className) => `'${className}'`)
      .join(", ");

    const instructions = `
Your task is to classify the user's request. 
Respond with ONLY the class name, and NO additional text.

Classes and their conditions:
${Object.entries(classificationDict)
  .map(
    ([resultClass, condition], index) =>
      `Class${index + 1}: "${resultClass}" if ${condition}. `
  )
  .join("")}

Possible answers: [${possibleClasses}].
`;

    // Append these instructions to the prompt
    this.prompt += instructions.trim() + "\n";

    return this;
  }

  toString(): string {
    return this.prompt.trim();
  }
}

export default LLMPromptBuilder;
