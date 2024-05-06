#!/usr/bin/env bash
if (process.argv[1]) {
  process.env.PROMPT = process.argv[1];
}
import "../index.js";
