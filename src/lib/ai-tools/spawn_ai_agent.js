import { Ai } from "../ai.js";
import { Context } from "../ai-context.js";

const model = "gpt-4-turbo-2024-04-09";
const context = new Context({});

export default {
  metadata: {
    description:
      "Spawn ai agent. Accepts human language prompt and can execute having the same tools available. The agent has access to the memory.",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "the task description the ai agent to execute",
        },
      },
      required: ["prompt"],
    },
  },
  async function({ prompt }, { selfDirectory }) {
    // console.log("[to -> fork]", prompt);
    context.selfDirectory = selfDirectory;
    const ai = new Ai({ model, context, master: false });
    const response = await ai.execute(prompt);
    // console.log("[from fork]", response);
    return response;
  },
};
