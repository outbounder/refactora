export class Context {
  constructor(messages = []) {
    this.messages = messages;
    this.totalToolCalls = 0;
  }

  appendMessage(message) {
    this.messages.push(message);
  }
}
