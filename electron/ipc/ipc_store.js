const { ipcMain } = require("electron");
const Store = require("electron-store").default;
const serviceName = "IPC Store:";

class IpcStore {
  static store = new Store();
  static register() {
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
