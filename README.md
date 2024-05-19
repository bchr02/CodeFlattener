# CodeFlattener

## Overview

`CodeFlattener` is a Node.js command-line tool designed to export the structure and code of a repository into a single flat JavaScript or ES module file. This tool simplifies the process of troubleshooting code that spans multiple files and obtaining advice from AI tools like ChatGPT. By consolidating your codebase into one file, you can more easily read and understand the code or provide comprehensive context to AI tools, enabling them to offer more accurate and helpful feedback.

## Features

- Recursively traverses a repository starting from the entry point file.
- Excludes `node_modules` folder by default.
- Supports including and excluding specific file types.
- Allows excluding specific folders.
- Outputs the consolidated code with relative file paths annotated as comments.

## Installation

### Global Installation

To install `CodeFlattener` globally, run the following command:

```sh
npm install -g codeflattener
```

### Usage

Once installed, you can use the `codeflattener` command to export your repository structure.

#### Basic Usage

```sh
codeflattener --output ./flattened-code.js
```

This command will:

- Traverse the current directory (default `--repo` is the current directory).
- Use the entry point file specified in `package.json` or `./index.js`.
- Include only `.js` and `.mjs` files by default.
- Exclude the `node_modules` folder by default.
- Output the consolidated code to `./flattened-code.js`.

#### Custom Repository Path

```sh
codeflattener --repo ./path-to-your-repo --output ./flattened-code.js
```

#### Custom Entry Point

```sh
codeflattener --repo ./path-to-your-repo --entry ./src/app.js --output ./flattened-code.js
```

#### Include and Exclude Specific File Types

```sh
codeflattener --repo ./path-to-your-repo --include .js,.json --exclude .test.js
```

#### Exclude Specific Folders

```sh
codeflattener --repo ./path-to-your-repo --excludeFolders dist,build
```

### Using npx

If you prefer not to install the package globally, you can use `npx` to run it directly:

```sh
npx codeflattener --repo ./path-to-your-repo --output ./flattened-code.js
```

### Command-Line Options

- `--repo` or `-r`: Path to the repository (default is the current directory).
- `--output` or `-o`: Path to the output file (default is `./flattened-code.js`).
- `--entry` or `-e`: Entry point file (default is `main` field in `package.json` or `./index.js`).
- `--include` or `-i`: Comma-separated list of file extensions to include (default is `.js,.mjs`).
- `--exclude` or `-x`: Comma-separated list of file extensions to exclude (default is none).
- `--excludeFolders` or `-f`: Comma-separated list of folder names to exclude (default is none).

## Example

```sh
codeflattener --repo ./my-repo --output ./flattened-code.js --include .js,.json --exclude .test.js --excludeFolders dist,build
```

This command will:

- Traverse the repository at `./my-repo` starting from the entry point specified in `package.json` or `./index.js`.
- Include `.js` and `.json` files.
- Exclude `.test.js` files.
- Exclude `dist` and `build` folders.
- Output the consolidated code to `./flattened-code.js`.

## License

This project is licensed under the MIT License.
