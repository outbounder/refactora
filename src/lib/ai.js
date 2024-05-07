import { complete } from "./ai-complete.js";
import aiTools, { generateTools } from "./ai-tools.js";

export class Ai {
  constructor(model, context) {
    this.model = model;
    this.context = context;
    this.context.messages.push({
      role: "system",
      content: `You're Refactora. 
          Intelligent assistant within the current working git repo.
          You can support users at any code related task.
          You can fork yourself to execute parallel repo-wide changes.
          You have a limited length of messages, however you can use memory tools to persist information.
          Everytime when you do planning use the memory with name 'plan' and return to it accordingly.
        `,
    });
  }
  async execute(input) {
    try {
      const tools = generateTools(aiTools);
      return complete({
        input,
        context: this.context,
        model: this.model,
        tools,
      });
    } catch (error) {
      console.error(error);
      console.info("----");
      console.info(this.context);
    }
  }
}
