import { promises as fs } from "fs";

const create_dir = {
  metadata: {
    description: "Create a new directory.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
      },
      required: ["path"],
    },
  },
  async function({ path }) {
    try {
      await fs.mkdir(path, { recursive: true });
      return { success: true, path };
    } catch (e) {
      return { success: false, error: e, path };
    }
  },
};

export default create_dir;
