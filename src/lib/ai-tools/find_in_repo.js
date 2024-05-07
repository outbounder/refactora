import { promises as fs } from "fs";
import ignore from "ignore";

import { walkDir } from "../utils.js";

const find_in_repo = {
  metadata: {
    description:
      "Find all files in the current working directory that contain a given string in their body or filename, respecting .gitignore.",
    parameters: {
      type: "object",
      properties: {
        searchString: { type: "string" },
      },
      required: ["searchString"],
    },
  },
  async function({ searchString }) {
    const ig = ignore();
    const gitignore = await fs.readFile(".gitignore", "utf8");
    ig.add(gitignore);

    const fileList = await walkDir(process.cwd(), ig);
    return fileList.filter(async (filePath) => {
      const file = path.basename(filePath);
      const fileContent = await fs.readFile(filePath, "utf8");
      return file.includes(searchString) || fileContent.includes(searchString);
    });
  },
};

export default find_in_repo;
