import { complete } from "./ai-complete.js";

export class Ai {
  constructor({ model, context }) {
    this.model = model;
    this.context = context;
  }
  async execute({ input, tools }) {
    try {
      return complete({
        input,
        context: this.context,
        model: this.model,
        tools,
      });
    } catch (error) {
      console.error(error);
      console.info("----");
      console.info(this.context);
    }
  }
}
