const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  restartApp: () => ipcRenderer.invoke("app:restart"),
  appTraffic: async (webContentsId) => {
    await ipcRenderer.invoke("app:traffic", webContentsId);
  },
  onAppTrafficUpdate: (callback) => {
    ipcRenderer.on("net:traffic", (event, data) => {
      callback(data);
    });
  },
  appReset: () => ipcRenderer.invoke("app:reset"),
});

contextBridge.exposeInMainWorld("prefs", {
  get: (key) => ipcRenderer.invoke("prefs:get", key),
  set: (key, value) => ipcRenderer.invoke("prefs:set", key, value),
});
