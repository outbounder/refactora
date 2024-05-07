import { exec } from "child_process";

export default {
  metadata: {
    description:
      "Fork yourself. Accepts human language prompt and can execute any of the tools available",
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
    return new Promise((resolve, reject) => {
      const cmd = `node ${selfDirectory}/bin/refactora ${prompt}`;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject({ code: error.code, output: stdout, error: stderr });
        } else {
          resolve({ code: 0, output: stdout });
        }
      });
    });
  },
};
