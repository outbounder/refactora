import { promises as fs } from "fs";
import path from "path";

export async function walkDir(dir, ig, fileList = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (filePath.includes(".git")) continue;
    if (!ig.ignores(filePath.replace(process.cwd() + path.sep, ""))) {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        fileList = await walkDir(filePath, ig, fileList);
      } else {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}
