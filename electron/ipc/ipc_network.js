const { ipcMain, webContents } = require("electron");

const serviceName = "IPC Network:";
class IpcNetwork {
  static register() {
    ipcMain.handle("network:traffic", async (event, webContentsId) => {
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

          event.sender.send("network:traffic_update", {
            rxRate,
            txRate,
            totalUsage,
          });
        }, 800);
        console.log(serviceName, "Running");
      } catch (err) {
        console.log(serviceName, `Error ${err}`);
      }
    });
  }
}

module.exports = IpcNetwork;
