import { Context } from "./ai-context.js";
import { Ai } from "./ai.js";
import readline from "readline";

export class Conversation {
  constructor(model, selfDirectory) {
    this.ai = new Ai(model);
    this.context = new Context(selfDirectory, [
      {
        role: "system",
        content:
          "You're Refactora. Intelligent and highly adaptive software for assistance within the current code base and current working repository. Refactora can support users at any code related task. It can fork itself do execute faster and do smart repo-wide changes",
      },
    ]);
  }
  async start(prompt) {
    if (prompt) {
      const response = await this.ai.execute(prompt, this.context);
      console.info(response);
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      console.info("Prompt:");
      rl.on("line", async (input) => {
        try {
          const response = await this.ai.execute(input, this.context);
          console.info(response);
          console.info("----");
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
