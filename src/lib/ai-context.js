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
}
