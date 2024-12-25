import { promises as fs } from "fs";
import path from "path";
import ignore from "ignore";

async function createIgnoreInstance(dir, parentIg = null) {
  const ig = parentIg ? ignore().add(parentIg) : ignore();
  const gitignorePath = path.join(dir, ".gitignore");
  try {
    const gitignore = await fs.readFile(gitignorePath, "utf8");
    ig.add(gitignore);
  } catch (err) {
    // If .gitignore doesn't exist, ignore the error
  }
  return ig;
}

export async function walkDir(dir, fileList = [], parentIg = null) {
  const ig = await createIgnoreInstance(dir, parentIg);
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (filePath.includes(".git")) continue;
    const relativePath = path.relative(process.cwd(), filePath);
    if (!ig.ignores(relativePath)) {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        fileList = await walkDir(filePath, fileList, ig);
      } else {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

export async function walkDirWithDepth(
  dir,
  depth = Infinity,
  fileList = [],
  parentIg = null,
  currentDepth = 0
) {
  if (currentDepth > depth) return fileList;
  const ig = await createIgnoreInstance(dir, parentIg);
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (filePath.includes(".git")) continue;
    const relativePath = path.relative(process.cwd(), filePath);
    if (!ig.ignores(relativePath)) {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        fileList = await walkDirWithDepth(
          filePath,
          depth,
          fileList,
          ig,
          currentDepth + 1
        );
      } else {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}
