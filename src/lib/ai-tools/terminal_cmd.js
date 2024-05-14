import { exec } from "child_process";

const terminal_cmd = {
  metadata: {
    description:
      "Spawn an unix terminal cmd and get its status code and output once done",
    parameters: {
      type: "object",
      properties: {
        cmd: { type: "string", description: "command" },
        cwd: { type: "string", description: "working directory" },
      },
      required: ["cmd"],
    },
  },
  async function({ cmd, cwd }) {
    return new Promise((resolve, reject) => {
      exec(cmd, { cwd }, (error, stdout, stderr) => {
        if (error) {
          reject({ code: error.code, output: stdout, error: stderr });
        } else {
          resolve({ code: 0, output: stdout });
        }
      });
    });
  },
};

export default terminal_cmd;
