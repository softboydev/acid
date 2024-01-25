const storage = require('electron-json-storage');
let ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('update-settings', function (event,store) {
    console.log(store);
});
const ipc = ipcRenderer

new ACIDGUI(storage,ipc)
