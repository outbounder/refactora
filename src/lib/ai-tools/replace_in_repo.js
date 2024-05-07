import { promises as fs } from "fs";
import ignore from "ignore";

import { walkDir } from "../utils.js";

const replace_in_repo = {
  metadata: {
    description:
      "Replace a given string in all files' contents and in files' names",
    parameters: {
      type: "object",
      properties: {
        searchString: { type: "string" },
        replaceString: { type: "string" },
        includePaths: {
          type: "array",
          items: { type: "string" },
          description:
            "uses filePath.includes(path), path should be relative to the repo",
        },
        excludePaths: {
          type: "array",
          items: { type: "string" },
          description:
            "uses filePath.includes(path), path should be relative to the repo",
        },
      },
      required: ["searchString", "replaceString"],
    },
  },
  async function({
    searchString,
    replaceString,
    includePaths = [],
    excludePaths = [],
  }) {
    const ig = ignore();
    const gitignore = await fs.readFile(".gitignore", "utf8");
    ig.add(gitignore);

    let fileList = await walkDir(process.cwd(), ig);
    const updatedFiles = [];

    // Filter files based on includePaths and excludePaths
    fileList = fileList.filter((filePath) => {
      const shouldInclude =
        includePaths.length > 0
          ? includePaths.some((path) => filePath.includes(path))
          : true;
      const shouldExclude =
        excludePaths.length > 0
          ? excludePaths.some((path) => filePath.includes(path))
          : false;
      return shouldInclude && !shouldExclude;
    });

    for (let filePath of fileList) {
      let file = path.basename(filePath);
      let fileContent = await fs.readFile(filePath, "utf8");
      if (file.includes(searchString) || fileContent.includes(searchString)) {
        fileContent = fileContent.replace(
          new RegExp(searchString, "g"),
          replaceString
        );
        await fs.writeFile(filePath, fileContent, "utf8");
        if (file.includes(searchString)) {
          const newFile = file.replace(
            new RegExp(searchString, "g"),
            replaceString
          );
          const newFilePath = path.join(path.dirname(filePath), newFile);
          await fs.rename(filePath, newFilePath);
          filePath = newFilePath;
        }
        updatedFiles.push(filePath);
      }
    }

    return updatedFiles;
  },
};

export default replace_in_repo;
