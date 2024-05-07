import { promises as fs } from "fs";
import ignore from "ignore";

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
    const ig = ignore();
    const gitignore = await fs.readFile(".gitignore", "utf8");
    ig.add(gitignore);

    return walkDir(process.cwd(), ig);
  },
};

export default repo_tree;
