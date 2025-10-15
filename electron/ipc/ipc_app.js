const { app, ipcMain, session } = require("electron");
const IpcStore = require("./ipc_store");
const { portablePath } = require("../config");
const serviceName = "IPC App:";

class IpcApp {
  static register() {
    ipcMain.handle("app:restart", async () => {
      restart();
    });

    ipcMain.handle("app:reset", async () => {
      await resetAppSession();
    });

    ipcMain.handle("app:path", () => {
      return portablePath.toString();
    });
    console.log(serviceName, "Registered");
  }
}

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
  IpcStore.store.clear();

  console.log("Electron session reset!");

  restart();
}

module.exports = IpcApp;
