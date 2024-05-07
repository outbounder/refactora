import { promises as fs } from "fs";

const read_file = {
  metadata: {
    description: "Read a file and return its content.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
      },
      required: ["path"],
    },
  },
  async function({ path }) {
    return fs.readFile(path, "utf8");
  },
};

export default read_file;
