const storage = require('electron-json-storage');
const canvas = document.getElementById("canvas")
const textlayer = document.getElementById("ascii")
let ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('update-settings', function (event,store) {
    console.log(store);
});
const ipc = ipcRenderer


new ACIDGUI(storage,ipc)
new ACID(storage,ipc,canvas,textlayer,"main")
