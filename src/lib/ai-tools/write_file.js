import { promises as fs } from "fs";

const write_file = {
  metadata: {
    description: "Write content to a file.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string" },
      },
      required: ["path", "content"],
    },
  },
  async function({ path, content }) {
    try {
      await fs.writeFile(path, content, "utf8");
      return { success: true, path };
    } catch (e) {
      return { success: false, error: e, path };
    }
  },
};

export default write_file;
