# Refactora 

Streamlines software development by providing essential tools for command execution, file management, source code management and repository inspection.

## Features

- **Command Execution**: Run shell commands directly within your projects.
- **File Management**: Read, write, delete, and manipulate files with ease.
- **Source Code Management**: Search, refactor, and replace code snippets within your repository.
- **Repository Inspection**: Get insights into your project's structure and contents.

## Getting Started

Integrate the command line utility on your system:

```bash
git clone refactora
cd refactora
npm install
```

### Environment Setup
Configure environment variables for secure operation:

1. Rename `.env.example` to `.env`.
2. Replace placeholder values in `.env` with your actual data (e.g., API keys).
3. Keep `.env` out of source control with `.gitignore`.

### Usage

```
cd my_prj
npm link /full/path/to/refactora
node node_modules/.bin/refactora
```

## Contributing
Enhance by forking the repository, making improvements, and submitting a pull request.

## License
Available under the MIT License.