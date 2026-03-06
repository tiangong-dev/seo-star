#!/usr/bin/env node

/**
 * Plasmo + Tailwind v4 Compatibility Patch
 *
 * Automatically fixes "node:" import issues in jiti and @tailwindcss/oxide
 * that cause Plasmo builds to fail when using Tailwind CSS v4.
 *
 * @see https://github.com/PlasmoHQ/plasmo/issues/1188
 */

const fs = require("fs");
const path = require("path");

// Console colors
const c = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

const log = (msg, color = "reset") =>
  console.log(`${c[color]}${msg}${c.reset}`);

/**
 * Find package files that need patching
 */
const findPackageFiles = () => {
  const nodeModules = path.resolve(process.cwd(), "node_modules");
  if (!fs.existsSync(nodeModules)) return [];

  const files = [];
  const pnpmPath = path.join(nodeModules, ".pnpm");

  const readDir = (dir) => {
    try {
      return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
    } catch {
      return [];
    }
  };

  const fileExists = (filePath) => {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  };

  const findJitiFiles = (basePath) => {
    const jitiPath = path.join(basePath, "jiti");
    if (!fileExists(jitiPath)) return [];

    const targets = ["dist/jiti.cjs", "dist/babel.cjs", "lib/jiti.cjs"];
    return targets
      .map((target) => path.join(jitiPath, target))
      .filter(fileExists);
  };

  const findOxideFiles = (basePath) => {
    const oxidePath = path.join(basePath, "@tailwindcss", "oxide", "index.js");
    return fileExists(oxidePath) ? [oxidePath] : [];
  };

  if (fileExists(pnpmPath)) {
    readDir(pnpmPath).forEach((entry) => {
      if (entry.startsWith("jiti@")) {
        const packagePath = path.join(pnpmPath, entry, "node_modules");
        files.push(...findJitiFiles(packagePath));
      }
      if (
        entry.startsWith("@tailwindcss+oxide@") ||
        entry.startsWith("%40tailwindcss+oxide@")
      ) {
        const packagePath = path.join(pnpmPath, entry, "node_modules");
        files.push(...findOxideFiles(packagePath));
      }
    });
  }

  files.push(...findJitiFiles(nodeModules));
  files.push(...findOxideFiles(nodeModules));

  return [...new Set(files)];
};

/**
 * Patch a single file: remove "node:" prefix from require() so Parcel can resolve Node built-ins
 */
const patchFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      log(`⚠️ File not found: ${path.basename(filePath)}`, "yellow");
      return false;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const hasNodeImports =
      content.includes('require("node:') || content.includes("require('node:");

    if (!hasNodeImports) {
      log(`✅ ${path.basename(filePath)} - already patched`, "green");
      return true;
    }

    const patched = content
      .replace(/require\("node:([^"]+)"\)/g, 'require("$1")')
      .replace(/require\('node:([^']+)'\)/g, "require('$1')");

    fs.writeFileSync(filePath, patched, "utf8");
    log(`✅ ${path.basename(filePath)} - patched successfully`, "green");
    return true;
  } catch (error) {
    log(`❌ ${path.basename(filePath)} - error: ${error.message}`, "red");
    return false;
  }
};

const main = () => {
  log("🔧 Plasmo + Tailwind v4 compatibility patch", "cyan");

  const files = findPackageFiles();

  if (files.length === 0) {
    log("⚠️ No files found to patch", "yellow");
    log(
      "  This might mean packages are not installed or using different structure",
      "yellow"
    );
    return;
  }

  log(`  Found ${files.length} files to check`, "blue");

  const results = files.map(patchFile);
  const successful = results.filter(Boolean).length;

  log("");

  if (successful === files.length) {
    log("🎉 All files patched successfully!", "green");
    log("  Tailwind v4 should now work with Plasmo", "green");
  } else {
    log(`⚠️ ${successful}/${files.length} files patched`, "yellow");
  }

  if (successful === 0) {
    log("💡 Try running: pnpm install && node scripts/patch.js", "blue");
  }
};

if (require.main === module) {
  main();
}

module.exports = { main, patchFile, findPackageFiles };
