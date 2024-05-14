import { Context } from "./ai-context.js";
import { Ai } from "./ai.js";
import readline from "readline";

export class Conversation {
  constructor(model, selfDirectory) {
    this.context = new Context({
      selfDirectory,
      systemMessage: `You're Refactora Master - an ai agent within the current working directory and git repo.`,
    });
    this.ai = new Ai({
      model,
      context: this.context,
    });
  }
  async start(prompt) {
    if (prompt) {
      const response = await this.ai.execute(prompt);
      console.info(response);
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      console.info("Prompt:");
      rl.on("line", async (input) => {
        try {
          const { response, duration } = await this.ai.execute(
            input,
            this.context
          );
          console.info(response);
          console.info("----");
          console.info(`finished complete in ${duration} seconds`);
          console.info("totalToolsCalls", this.context.totalToolCalls);
          console.info("context.messages.length", this.context.messages.length);
          console.info("Prompt:");
        } catch (error) {
          console.error("Error in processing response:", error);
        }
      });

      rl.on("close", () => {
        console.log("Session ended.");
      });
    }
  }
}
