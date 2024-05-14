import { memory } from "./store.js";

const list_memory = {
  metadata: {
    description:
      "Gets a list of all stored names from shared memory without their values",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  async function({}) {
    return Object.keys(memory);
  },
};

export default list_memory;
