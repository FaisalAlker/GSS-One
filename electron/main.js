const {
  app,
  BrowserWindow,
  ipcMain,
  webContents,
  session,
  screen,
} = require("electron");
const path = require("path");
const store = require("./store.js");

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

ipcMain.handle("app:restart", async () => {
  restart();
});

ipcMain.handle("app:traffic", async (event, webContentsId) => {
  console.log("app traffic triggered");
  const wc = webContents.fromId(webContentsId);
  if (!wc) return console.error("WebContents not found:", webContentsId);

  try {
    wc.debugger.attach("1.3");
    wc.debugger.sendCommand("Network.enable");

    let rxBytes = 0;
    let txBytes = 0;
    let lastRx = 0;
    let lastTx = 0;
    let totalRx = 0;
    let totalTx = 0;

    wc.debugger.on("message", (event, method, params) => {
      if (method === "Network.dataReceived") {
        rxBytes += params.encodedDataLength || 0;
      } else if (method === "Network.dataSent") {
        txBytes += params.encodedDataLength || 0;
      } else if (method === "Network.requestWillBeSent") {
        // Approximate header size
        const headerSize = JSON.stringify(params.request.headers).length;
        txBytes += headerSize;
      }
    });

    setInterval(() => {
      const rxRate = (rxBytes - lastRx) / 1024;
      const txRate = (txBytes - lastTx) / 1024;
      lastRx = rxBytes;
      lastTx = txBytes;

      // Keep accumulating totals (in MB)
      totalRx = rxBytes / 1024 / 1024;
      totalTx = txBytes / 1024 / 1024;
      const totalUsage = totalRx + totalTx;

      event.sender.send("net:traffic", { rxRate, txRate, totalUsage });
    }, 800);
  } catch (err) {
    console.error("Traffic tracking failed:", err);
  }
});

function restart() {
  var opt = {};
  opt.args = process.argv.slice(1).concat(["--relaunch"]);
  opt.execPath = process.execPath;
  if (app.isPackaged && process.env.PORTABLE_EXECUTABLE_FILE != undefined) {
    opt.execPath = process.env.PORTABLE_EXECUTABLE_FILE;
  }
  app.relaunch(opt);
  app.exit(0);
  // app.quit(); // Try this if error on exit
}

app.whenReady().then(createWindow);

ipcMain.handle("prefs:get", (event, key) => {
  return store.get(key);
});

ipcMain.handle("prefs:set", (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle("app:reset", async () => {
  await resetAppSession();
});

async function resetAppSession() {
  const ses = session.defaultSession;
  // Clear all cookies
  await ses.clearStorageData({ storages: ["cookies"] });

  // Clear cache & localStorage & indexedDB
  await ses.clearStorageData({
    storages: [
      "localstorage",
      "indexdb",
      "filesystem",
      "cachestorage",
      "serviceworkers",
    ],
  });
  store.clear();

  console.log("✅ Electron session reset!");

  restart();
}
