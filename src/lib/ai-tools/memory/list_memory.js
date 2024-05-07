import { memory } from "./store.js";

const list_memory = {
  metadata: {
    description:
      "Gets a list of all memory names. Useful to get a list of what is stored in memory",
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
