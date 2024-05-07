import { complete } from "./ai-complete.js";

export class Ai {
  constructor(model, context) {
    this.model = model;
    this.context = context;
    this.context.messages.push({
      role: "system",
      content: `You're Refactora. 
          Intelligent and highly adaptive software for assistance within the current code base and working git repo.
          You can support users at any code related task.
          You can fork yourself to execute parallel repo-wide changes.
        `,
    });
  }
  async execute(input) {
    try {
      return complete({
        input,
        context: this.context,
        model: this.model,
      });
    } catch (error) {
      console.error(error);
      console.info("----");
      console.info(context);
    }
  }
}
