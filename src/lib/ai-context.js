export class Context {
  constructor(selfDirectory, messages = []) {
    this.selfDirectory = selfDirectory;
    this.messages = messages;
    this.totalToolCalls = 0;
  }

  appendMessage(message) {
    this.messages.push(message);
  }
}
