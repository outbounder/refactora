import { Ai } from "../ai.js";
import { Context } from "../ai-context.js";
import aiTools, { generateTools } from "../ai-tools.js";

const model = "gpt-4o";
const context = new Context({
  systemMessage: `You're Refactora Fork - an ai agent within the current working directory and git repo.
    You're spawned from Refactora Master to do a specific task.
  `,
});

export default {
  metadata: {
    description:
      "Spawn ai agent with Refactora's tools. The agent has access to the shared memory with Refactora accessible through tools.",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "the task description the ai agent to execute",
        },
        debug: {
          type: "boolean",
          description: "will run the tool in debug mode",
        },
      },
      required: ["prompt"],
    },
  },
  async function({ prompt, debug }, { selfDirectory }) {
    if (debug) console.log("[to -> fork]", prompt);
    context.selfDirectory = selfDirectory;
    const ai = new Ai({
      model,
      context,
    });
    const response = await ai.execute({
      input: prompt,
      tools: generateTools(aiTools),
    });
    if (debug) console.log("[from fork]", response);
    return response;
  },
};
