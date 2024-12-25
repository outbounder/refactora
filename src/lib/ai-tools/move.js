import { promises as fs } from "fs";
import path from "path";

const move_file = {
  metadata: {
    description: "Move a file from the source path to the destination path.",
    parameters: {
      type: "object",
      properties: {
        source: { type: "string" },
        destination: { type: "string" },
      },
      required: ["source", "destination"],
    },
  },
  async function({ source, destination }) {
    await fs.rename(source, destination);
    return {
      success: true,
      message: `File moved from ${source} to ${destination} successfully.`,
    };
  },
};

export default move_file;
