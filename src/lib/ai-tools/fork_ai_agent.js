import { exec } from "child_process";

export default {
  metadata: {
    description:
      "Fork an Refactora AI agent to do a job. It can do everything Refactora can do. Useful to do parallel tasks against set of files & other assignments.",
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
  }
};