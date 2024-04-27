import { complete } from "./ai-complete.js";

export class Ai {
  constructor(model) {
    this.model = model;
  }
  async execute(input, context) {
    try {
      return complete({
        input,
        context,
        model: this.model,
      });
    } catch (error) {
      console.error(error);
      console.info("----");
      console.info(context);
    }
  }
}
