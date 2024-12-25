import { walkDirWithDepth } from "../utils.js";

const repo_tree = {
  metadata: {
    description:
      "Get all files from the current working directory with optional depth.",
    parameters: {
      type: "object",
      properties: {
        depth: {
          type: "number",
          description:
            "The depth level to which the directory tree should be retrieved, default is 4",
        },
        dir: {
          type: "string",
          description:
            "The directory to be tree-ed, default is current working directory.",
        },
      },
      required: [],
    },
  },
  async function({ depth = 4, dir = process.cwd() } = {}) {
    const result = await walkDirWithDepth(dir, depth);
    return result;
  },
};

export default repo_tree;
