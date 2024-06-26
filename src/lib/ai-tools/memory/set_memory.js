// set_memory module - provides a function to store data in memory dynamically

import { memory } from "./store.js";

// Function and metadata definition
const set_memory = {
  metadata: {
    description: "Sets a value to a name in shared memory.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        value: { type: "string" },
      },
      required: ["name", "value"],
    },
  },
  async function({ name, value }) {
    memory[name] = value;
    return { success: true };
  },
};

// Export the function
export default set_memory;
