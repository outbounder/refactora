const cwd = {
  metadata: {
    description: "Get the current working directory.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  async function() {
    return process.cwd();
  },
};
export default cwd;
