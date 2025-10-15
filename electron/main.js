const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const { setPortablePath } = require("./config");
const IpcStore = require("./ipc/ipc_store");
const IpcApp = require("./ipc/ipc_app");
const IpcNetwork = require("./ipc/ipc_network");

// Init Setup Portable Path
setPortablePath();

function createWindow() {
  const display = screen.getPrimaryDisplay();

  const mainWindow = new BrowserWindow({
    width: display.workArea.width,
    height: display.workArea.height,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
  });

  mainWindow.removeMenu();

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();
  IpcApp.register();
  IpcNetwork.register();
  IpcStore.register();
});
