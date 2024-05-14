import { Ai } from "../ai.js";
import { Context } from "../ai-context.js";

const model = "gpt-4-turbo-2024-04-09";
const context = new Context({
  systemMessage: `You're FileRefactora. You can refactor any source code file into one or many files.
        You execute the task so that the code after is fully implemented maintaing the business logic of the code.
        In a nut shell this means to:
        1. read the souce code file and analyze it
        2. extract the sections of the code which can be placed in separate source code files
        3. make sure that the extract source code files are fully implemented
        4. back reference these files into the original source code file so that it maintains its public api and can be utilized same as before the refactoring.
      `,
});

export default {
  metadata: {
    description:
      "Refactor a file into many files. Accepts human language prompt input. The agent has access to the shared memory.",
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
    console.log("[to -> refactor]", prompt);
    context.selfDirectory = selfDirectory;
    const ai = new Ai({
      model,
      context,
    });
    const response = await ai.execute(prompt);
    console.log("[from refactor]", response);
    return response;
  },
};
