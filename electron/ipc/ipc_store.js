const { ipcMain } = require("electron");
const Store = require("electron-store").default;
const path = require("path");
const { portablePath } = require("../config");
const serviceName = "IPC Store:";

class IpcStore {
  static store = new Store({
    cwd: path.join(portablePath, "temp"),
    name: "store",
  });

  static register() {
    console.log(path.join(portablePath, "data").toString());
    ipcMain.handle("prefs:get", (event, key) => {
      return IpcStore.store.get(key);
    });

    ipcMain.handle("prefs:set", (event, key, value) => {
      IpcStore.store.set(key, value);
      return true;
    });
    console.log(serviceName, "Registered");
  }
}

module.exports = IpcStore;
