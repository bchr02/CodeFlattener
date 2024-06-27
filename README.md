# CodeFlattener

`CodeFlattener` is a Node.js tool designed to consolidate your codebase into a single JavaScript file. This single file can then be used to obtain advice from AI tools like ChatGPT. The generated file is not meant to be run as an application but rather to provide a comprehensive view of your codebase for analysis and guidance.

## Purpose

The primary purpose of `CodeFlattener` is to facilitate obtaining advice from AI tools like ChatGPT. By consolidating your codebase into a single JavaScript file, you can more easily and quickly provide context to AI tools, allowing them to offer more accurate and comprehensive feedback. This tool is especially useful for large projects where understanding the code requires looking at multiple interconnected files.

## Features

- Consolidates all JavaScript and TypeScript files into a single file.
- Supports ES modules.
- Resolves and includes imported files.
- Handles aliases specified in `package.json`.
- Transpiles TypeScript files to JavaScript.
- Allows excluding specific file types and folders.

## Installation

To install `CodeFlattener` globally, run:

```sh
npm install -g codeflattener
```

## Usage

To use `CodeFlattener`, navigate to your project directory and run:

```sh
npx codeflattener --repo path/to/repo --output path/to/output.js
```

### Options

- `--repo`: The path to the repository. Defaults to the current directory.
- `--output`: The path to the output file. Defaults to `./flattened-code.js`.
- `--entry`: The entry point file. Defaults to the `main` file specified in `package.json` or `./index.js`.
- `--include`: Comma-separated list of file extensions to include. Defaults to `.js,.mjs,.ts,.tsx`.
- `--exclude`: Comma-separated list of file extensions to exclude.
- `--excludeFolders`: Comma-separated list of folders to exclude.

### Example

```sh
npx codeflattener --repo ./my-project --output ./flattened-code.js --include .js,.mjs,.ts,.tsx --exclude .test.js --excludeFolders node_modules,dist
```

## Important Note

The generated JavaScript file is not meant to be run as an application. It is intended to provide a comprehensive view of your codebase for analysis and obtaining advice from AI tools like ChatGPT. Running the generated file as an application will not work as expected.

## License

This project is licensed under the MIT License.
