// get_memory module - provides a function to retrieve data from memory dynamically

import { memory } from "./store.js";

// Function and metadata definition
const get_memory = {
  metadata: {
    description:
      "Gets a value to a name from runtime memory. Useful to get intermediate data like plan for execution, progress, expectations, requirements and other data",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
  },
  async function({ name }) {
    return memory[name];
  },
};

// Export the function
export default get_memory;
