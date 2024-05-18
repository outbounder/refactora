import dotenv from "dotenv";
import { Conversation } from "./lib/conversation.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (process.argv[2]) {
  process.env.PROMPT = process.argv[2];
}

console.info("running at ", process.cwd());
console.info("loading .env from ", __dirname);
dotenv.config({ path: __dirname + "/../.env" });
const conversation = new Conversation(process.env.MODEL || "gpt-4o", __dirname);
conversation.start(process.env.PROMPT);
