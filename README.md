# AI Development Environment Toolkit

This toolkit streamlines AI development by providing essential tools for command execution, file management, and repository inspection.

## Features
- **Terminal Commands Execution**: Manage Unix terminal commands directly from your application.
- **File and Directory Management**: Easily handle reading, writing, and organizing project files.
- **Repository Inspection**: Efficiently manage and modify your codebase.

## Getting Started

Integrate the toolkit into your project:

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
Enhance the toolkit by forking the repository, making improvements, and submitting a pull request.

## License
Available under the MIT License.