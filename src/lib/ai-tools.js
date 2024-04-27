import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import ignore from "ignore";

const aiTools = {
  terminal_cmd: {
    metadata: {
      description:
        "Spawn an unix terminal cmd and get its status code and output once done. The cmd is always started in repo's root forlder.",
      parameters: {
        type: "object",
        properties: {
          cmd: { type: "string" },
        },
        required: ["cmd"],
      },
    },
    async function({ cmd }) {
      return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            reject({ code: error.code, output: stderr });
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
      return fs.mkdir(path, { recursive: true });
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

      const walkDir = async (dir, fileList = []) => {
        const files = await fs.readdir(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (!ig.ignores(filePath.replace(process.cwd() + path.sep, ""))) {
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
              fileList = await walkDir(filePath, fileList);
            } else {
              fileList.push(filePath);
            }
          }
        }
        return fileList;
      };

      return walkDir(process.cwd());
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

      const walkDir = async (dir, fileList = []) => {
        const files = await fs.readdir(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (!ig.ignores(filePath.replace(process.cwd() + path.sep, ""))) {
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
              fileList = await walkDir(filePath, fileList);
            } else {
              const fileContent = await fs.readFile(filePath, "utf8");
              if (
                file.includes(searchString) ||
                fileContent.includes(searchString)
              ) {
                fileList.push(filePath);
              }
            }
          }
        }
        return fileList;
      };

      return walkDir(process.cwd());
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

      const walkDir = async (dir, fileList = []) => {
        const files = await fs.readdir(dir);
        for (let file of files) {
          let filePath = path.join(dir, file);
          if (!ig.ignores(filePath.replace(process.cwd() + path.sep, ""))) {
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
              fileList = await walkDir(filePath, fileList);
            } else {
              let fileContent = await fs.readFile(filePath, "utf8");
              if (
                file.includes(searchString) ||
                fileContent.includes(searchString)
              ) {
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
                  const newFilePath = path.join(dir, newFile);
                  await fs.rename(filePath, newFilePath);
                  filePath = newFilePath;
                }
                fileList.push(filePath);
              }
            }
          }
        }
        return fileList;
      };

      return walkDir(process.cwd());
    },
  },
};

export default aiTools;
