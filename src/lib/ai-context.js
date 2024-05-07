export class Context {
  constructor(selfDirectory, messages = []) {
    this.selfDirectory = selfDirectory;
    this.messages = messages;
    this.totalToolCalls = 0;
  }

  appendMessage(message) {
    this.messages.push(message);
    if (this.messages.length > 20) {
      const systemMsg = this.messages[0];
      this.messages = [systemMsg, ...this.messages.slice(2)];
      console.info("(CONTEXT) messages truncated by 1");
    }
  }
}
