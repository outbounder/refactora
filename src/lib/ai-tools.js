import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import ignore from "ignore";

import { walkDir } from "./utils.js";

const aiTools = {
  terminal_cmd: {
    metadata: {
      description:
        "Spawn an unix terminal cmd and get its status code and output once done. The cmd is always started in repo's root forlder.",
      parameters: {
        type: "object",
        properties: {
          cmd: { type: "string", description: "command" },
          cwd: { type: "string", description: "working directory" },
        },
        required: ["cmd"],
      },
    },
    async function({ cmd, cwd }) {
      return new Promise((resolve, reject) => {
        exec(cmd, { cwd }, (error, stdout, stderr) => {
          if (error) {
            reject({ code: error.code, output: stdout, error: stderr });
          } else {
            resolve({ code: 0, output: stdout });
          }
        });
      });
    },
  },
  cwd: {
    metadata: {
      description: "Get the current working directory.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    async function() {
      return process.cwd();
    },
  },
  create_dir: {
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
  },
  read_file: {
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
  },
  write_file: {
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
  },
  repo_tree: {
    metadata: {
      description:
        "Get all files from the current working directory, respecting .gitignore.",
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
  },
  find_in_repo: {
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
        return (
          file.includes(searchString) || fileContent.includes(searchString)
        );
      });
    },
  },
  replace_in_repo: {
    metadata: {
      description:
        "Replace a given string in all files' contents and in file names and directory names in the current working directory, respecting .gitignore.",
      parameters: {
        type: "object",
        properties: {
          searchString: { type: "string" },
          replaceString: { type: "string" },
        },
        required: ["searchString", "replaceString"],
      },
    },
    async function({ searchString, replaceString }) {
      const ig = ignore();
      const gitignore = await fs.readFile(".gitignore", "utf8");
      ig.add(gitignore);

      const fileList = await walkDir(process.cwd(), ig);
      const updatedFiles = [];

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
  },
};

export default aiTools;
