import { exec, fork } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import ignore from "ignore";

import { walkDir } from "./utils.js";

import set_memory from "./memory/set_memory.js";

const aiTools = {
  set_memory,
  get_memory: {
    metadata: {
      description:
        "Gets a value to a name from runtime memory. Useful to get intermediate data like plan for execution, progress, expectations, requirements and other data",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
        required: ["name"],
      },
    },
    async function({ name }) {
      return memory[name];
    },
  },
  list_memory: {
    metadata: {
      description:
        "Gets a list of all memory names. Useful to get a list of what is stored in memory",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    async function({}) {
      return Object.keys(memory);
    },
  },
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
  fork_ai_agent: {
    metadata: {
      description:
        "Fork an Refactora AI agent to do a job. It can do everything Refactora can do. Useful to do parallel tasks agains set of files & other assignments.",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "the task description the ai agent to execute",
          },
        },
        required: ["prompt"],
      },
    },
    async function({ prompt }, { selfDirectory }) {
      return new Promise((resolve, reject) => {
        const cmd = `node ${selfDirectory}/bin/refactora ${prompt}`;
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
  },
};

export default aiTools;
