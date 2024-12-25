import { encoding_for_model } from "tiktoken";

export class Context {
  constructor({ selfDirectory, messages = [], systemMessage }) {
    this.selfDirectory = selfDirectory;
    this.messages = messages;
    this.totalToolCalls = 0;
    if (systemMessage) {
      this.messages.push({
        role: "system",
        content: systemMessage,
      });
    }
  }

  appendMessage(message) {
    this.messages.push(message);
  }

  getMessagesTruncated(maxTokens = 2 * 4096) {
    const enc = encoding_for_model("gpt-4o");
    let tokenCount = 0;
    const truncatedMessages = [];

    // Always include the first 2 messages
    for (let i = 0; i < 2 && i < this.messages.length; i++) {
      const message = this.messages[i];
      truncatedMessages.push(message);
      if (message.content) {
        const tokens = enc.encode(message.content);
        tokenCount += tokens.length;
      }
    }

    // Add messages from the start until maxTokens is reached
    for (let i = 2; i < this.messages.length; i++) {
      const message = this.messages[i];
      truncatedMessages.push(message);
      if (message.content) {
        const tokens = enc.encode(message.content);
        if (tokenCount + tokens.length > maxTokens) break;
        tokenCount += tokens.length;
      }
    }

    return truncatedMessages;
  }
}
