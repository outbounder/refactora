import { walkDir } from "../utils.js";

const repo_tree = {
  metadata: {
    description: "Get all files from the current working directory.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  async function() {
    const result = await walkDir(process.cwd());
    return result;
  },
};

export default repo_tree;
