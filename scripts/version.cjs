#!/usr/bin/env node
/* global __dirname */

const { readFile, writeFile } = require("node:fs/promises");
const { join } = require("node:path");
const { format } = require("prettier");

async function main() {
  let pkgJson = await readFile(join(__dirname, "..", "package.json"), "utf8");
  pkgJson = JSON.parse(pkgJson);
  let appJson = await readFile(join(__dirname, "..", "app.json"), "utf8");
  appJson = JSON.parse(appJson);
  appJson.expo.version = pkgJson.version;
  appJson = JSON.stringify(appJson, null, 2);
  appJson = await format(appJson, { parser: "json" });
  await writeFile("./app.json", appJson);
}

main();
