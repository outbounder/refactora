import dotenv from "dotenv";
import { Conversation } from "./lib/conversation.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.info("running at ", process.cwd());
console.info("loading .env from ", __dirname);
dotenv.config({ path: __dirname + "/../.env" });
const conversation = new Conversation("gpt-4-turbo-2024-04-09");
conversation.start();
