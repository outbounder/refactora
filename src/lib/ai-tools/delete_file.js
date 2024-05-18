import { promises as fs } from "fs";

const delete_file = {
  metadata: {
    description: "Delete a file at the specified path.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
      },
      required: ["path"],
    },
  },
  async function({ path }) {
    await fs.unlink(path);
    return { success: true, message: `File at ${path} deleted successfully.` };
  },
};

export default delete_file;
