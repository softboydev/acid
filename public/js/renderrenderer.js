const storage = require('electron-json-storage');
const canvas = document.getElementById("canvas")
const textlayer = document.getElementById("ascii")
let ipcRenderer = require('electron').ipcRenderer;
const ipc = ipcRenderer

new ACID(storage,ipc,canvas,textlayer,"standalone")
