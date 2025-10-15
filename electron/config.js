const { app } = require("electron");
const path = require("path");
const fs = require("fs");

// Get where the app executable is located
function getExecPath() {
  let exePath;

  if (app.isPackaged) {
    // Check if it's a portable executable (electron-builder portable target)
    if (process.env.PORTABLE_EXECUTABLE_FILE) {
      exePath = path.join(
        path.dirname(process.env.PORTABLE_EXECUTABLE_FILE),
        "gss-data"
      );
    } else {
      // Normal packaged app (installed or unpacked)
      exePath = path.join(path.dirname(app.getPath("exe")), "gss-data");
    }
  } else {
    // Development mode
    exePath = path.join(__dirname, "gss-data");
  }

  console.log("ExecPath:", exePath);
  return exePath;
}

const portablePath = getExecPath();

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const dataPath = path.join(portablePath, "data");
const tempPath = path.join(portablePath, "temp");

ensureDir(dataPath);
ensureDir(tempPath);

async function setPortablePath() {
  try {
    app.setPath("userData", dataPath);
    app.setPath("temp", tempPath);
  } catch (err) {
    console.error("[Portable] Failed to set portable paths:", err);
  }
}

module.exports = { setPortablePath, portablePath };
