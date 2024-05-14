import set_memory from "./ai-tools/memory/set_memory.js";
import get_memory from "./ai-tools/memory/get_memory.js";
import list_memory from "./ai-tools/memory/list_memory.js";
import terminal_cmd from "./ai-tools/terminal_cmd.js";
import spawn_ai_agent from "./ai-tools/spawn_ai_agent.js";
import cwd from "./ai-tools/cwd.js";
import create_dir from "./ai-tools/create_dir.js";
import read_file from "./ai-tools/read_file.js";
import write_file from "./ai-tools/write_file.js";
import repo_tree from "./ai-tools/repo_tree.js";
import find_in_repo from "./ai-tools/find_in_repo.js";
import replace_in_repo from "./ai-tools/replace_in_repo.js";

// Generate dynamic tools object
export const generateTools = function (service) {
  const tools = [];
  for (const [key, serviceFunction] of Object.entries(service)) {
    if (serviceFunction.metadata) {
      tools.push({
        type: "function",
        function: {
          name: key,
          description: serviceFunction.metadata.description,
          parameters: serviceFunction.metadata.parameters,
        },
      });
    }
  }
  return tools;
};

const aiTools = {
  generateTools,
  set_memory,
  get_memory,
  list_memory,
  terminal_cmd,
  spawn_ai_agent,
  cwd,
  create_dir,
  read_file,
  write_file,
  repo_tree,
  find_in_repo,
  replace_in_repo,
};

export default aiTools;
