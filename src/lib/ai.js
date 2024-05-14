import { complete } from "./ai-complete.js";
import aiTools, { generateTools } from "./ai-tools.js";

export class Ai {
  constructor({ model, context, master = true }) {
    this.model = model;
    this.context = context;
    this.master = master;
    if (this.master) {
      this.context.messages.push({
        role: "system",
        content: `You're Refactora Master - an ai agent within the current working directory and git repo.
            You support users at any code related request.
            Once a task is done you check is it complete and if not you continue iterating until it is verified complete.
          `,
      });
    } else {
      // fork
      this.context.messages.push({
        role: "system",
        content: `You're Refactora Fork - an ai agent within the current working directory and git repo.
            You're spawned from Refactora Master to do a specific task.
          `,
      });
    }
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
