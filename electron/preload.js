const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  restart: () => ipcRenderer.invoke("app:restart"),
  reset: () => ipcRenderer.invoke("app:reset"),
});

contextBridge.exposeInMainWorld("network", {
  traffic: async (webContentsId) => {
    await ipcRenderer.invoke("network:traffic", webContentsId);
  },
  trafficUpdate: (callback) => {
    ipcRenderer.on("network:traffic_update", (event, data) => {
      callback(data);
    });
  },
});

contextBridge.exposeInMainWorld("prefs", {
  get: (key) => ipcRenderer.invoke("prefs:get", key),
  set: (key, value) => ipcRenderer.invoke("prefs:set", key, value),
});
