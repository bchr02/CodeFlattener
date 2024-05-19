#!/usr/bin/env node

import fs from "fs";
import path from "path";
import minimist from "minimist";
import { init, parse } from "es-module-lexer";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Helper function to resolve import aliases
function resolveAlias(importPath, aliases, repoPath) {
  for (const [alias, target] of Object.entries(aliases)) {
    if (importPath.startsWith(alias)) {
      const relativePath = importPath.replace(alias, target);
      return path.resolve(repoPath, relativePath);
    }
  }
  return null;
}

async function getAllFiles(entryFile, repoPath, include, exclude, excludeFolders, aliases) {
  await init; // Ensure the lexer is initialized

  const allFiles = new Set();
  const stack = [entryFile];

  while (stack.length > 0) {
    const file = stack.pop();
    if (!allFiles.has(file)) {
      allFiles.add(file);
      const content = fs.readFileSync(file, "utf-8");
      const [imports] = parse(content);

      for (const importStatement of imports) {
        let importPath = content.substring(importStatement.s, importStatement.e).replace(/['"]/g, "");

        let resolvedPath = null;

        // Handle aliases
        if (importPath.startsWith("#")) {
          resolvedPath = resolveAlias(importPath, aliases, repoPath);
        }

        if (!resolvedPath) {
          // Handle relative paths
          if (importPath.startsWith(".")) {
            resolvedPath = path.resolve(path.dirname(file), importPath);
          } else {
            // Skip non-local and non-aliased imports
            continue;
          }
        }

        let ext = path.extname(resolvedPath);

        if (!ext) {
          for (const extension of [".js", ".mjs", ".json"]) {
            if (fs.existsSync(resolvedPath + extension)) {
              resolvedPath += extension;
              ext = extension;
              break;
            }
          }
        }

        if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
          if (include.includes(ext) && !exclude.includes(ext)) {
            stack.push(resolvedPath);
          }
        }
      }
    }
  }

  return Array.from(allFiles).filter((file) => {
    return !excludeFolders.some((folder) => file.includes(path.sep + folder + path.sep));
  });
}

async function createFlatFile(entryFile, repoPath, outputPath, include, exclude, excludeFolders, aliases) {
  const allFiles = await getAllFiles(entryFile, repoPath, include, exclude, excludeFolders, aliases);
  let content = "";

  allFiles.forEach(function (file) {
    const relativePath = path.relative(path.dirname(entryFile), file);
    const fileContent = fs.readFileSync(file, "utf-8");
    content += `// --- ${relativePath} ---\n// The content below is from ${relativePath}. Please provide guidance based on this path.\n\n${fileContent}\n\n`;
  });

  fs.writeFileSync(outputPath, content, "utf-8");
}

const args = minimist(process.argv.slice(2));
const repoPath = args.repo || process.cwd(); // Default to current directory
const outputPath = args.output || "./flattened-code.js"; // Default output path

let entryFromPackageJson = "./index.js";
let aliases = {};
try {
  const packageJson = require(path.resolve(repoPath, "package.json"));
  entryFromPackageJson = packageJson.main || entryFromPackageJson;
  if (packageJson.imports) {
    aliases = Object.fromEntries(Object.entries(packageJson.imports).map(([key, value]) => [key.replace("/*", ""), value.replace("/*", "")]));
  }
} catch (error) {
  console.warn("Failed to load package.json, defaulting to ./index.js");
}

const entryFile = path.resolve(repoPath, args.entry || entryFromPackageJson);
const include = args.include ? args.include.split(",") : [".js", ".mjs"];
const exclude = args.exclude ? args.exclude.split(",") : [];
const excludeFolders = args.excludeFolders ? args.excludeFolders.split(",") : [];

console.log(`Entry file: ${entryFile}`);
console.log(`Include extensions: ${include}`);
console.log(`Exclude extensions: ${exclude}`);
console.log(`Exclude folders: ${excludeFolders}`);
console.log(`Aliases: ${JSON.stringify(aliases)}`);

createFlatFile(entryFile, repoPath, outputPath, include, exclude, excludeFolders, aliases);
