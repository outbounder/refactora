export class Context {
  constructor(messages = []) {
    this.messages = messages;
    this.totalToolCalls = 0;
  }
}
