#!/usr/bin/env bash
import "dotenv/config";
import { Conversation } from "./lib/conversation.js";
const conversation = new Conversation("gpt-4-turbo-2024-04-09");
conversation.start();
