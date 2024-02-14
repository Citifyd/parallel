const fs = require("fs");
const path = require("path");

function execute(maxParts, currentPart, customDirectory) {
  const directoryPath = customDirectory || "./test"; // Replace this with the path to your directory

  const filesArr = [];
  function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile() && (file.endsWith(".ts") || file.endsWith(".js"))) {
        filesArr.push(filePath);
        // Log file path or do whatever you need with it
      } else if (stats.isDirectory()) {
        traverseDirectory(filePath); // Recursively traverse subdirectories
      }
    });
  }

  traverseDirectory(directoryPath);

  const currentPartFiles = Math.ceil(filesArr.length / maxParts);

  return filesArr.slice(
    currentPart === 1 || currentPart === 0
      ? 0
      : currentPartFiles * (currentPart - 1),
    currentPartFiles * currentPart
  );
}

if (process.argv.length < 3) {
  console.log("Usage: node parallel.js <max> <current>");
  process.exit(1);
}

const max = process.argv[2];
const current = process.argv[3];
let customDirectory = null;

if (process.argv.length > 3) {
  customDirectory = process.argv[4];
}

if (isNaN(max) || isNaN(current)) {
  console.log("Invalid input");
  process.exit(1);
}

if (max < 1 || current < 1) {
  console.log("Invalid input");
  process.exit(1);
}

console.log(execute(12, 1, customDirectory).join(" "));
