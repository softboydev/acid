// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// window.config =

// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
const storage = require('electron-json-storage');
const isDev = require("electron-is-dev");

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(error => console.log(`An error occurred: , ${error}`));
  }
});

let mainWindow

ipcMain.on('requestUpdate', (event) => {
  console.log("update");
  requireUpdate()
})
function requireUpdate(){
  mainWindow.webContents.send("requireUpdate");
}
function requireAction(sender,prefix){
prefix = prefix || ""
mainWindow.webContents.send("require" + prefix + sender.label);
}
function requireOneFramejump(){
mainWindow.webContents.send("requireOneFramejump");
}
function requireTenFramesjump(){
mainWindow.webContents.send("requireTenFramesjump");
}
function requireRefresh(){
mainWindow.webContents.send("requireRefresh");
if(renderWindow){
  renderWindow.webContents.send("requireRefresh");
}
}

function openFile(){
dialog.showOpenDialog(mainWindow, {
  properties: ['openFile']
}).then(result => {
  if(!result.canceled && result.filePaths.length > 0){
    let filepath = result.filePaths[0]
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if(err){
          alert("An error ocurred reading the file :" + err.message);
          return;
      }
      else{
        storage.set("config", data, function(error) {
          if (error){
            console.log("Error storing JSON " + error)
          }
          else{
            requireUpdate()
          }
        })
      }
    })
  }
})
}


function createWindow () {
mainWindow = new BrowserWindow({
  width: 600,
  height: 600,
  minWidth: 200,
  minHeight: 200,
  backgroundColor: '#000000',
  // icon: path.join(__dirname, { darwin: 'icon.icns', linux: 'icon.png', win32: 'icon.ico' }[process.platform] || 'icon.ico'),
  // frame: process.platform !== 'darwin',
  // skipTaskbar: process.platform === 'darwin',
  // autoHideMenuBar: process.platform === 'darwin',
  webPreferences: {
    devTools: true,
    enableRemoteModule: true,
    nodeIntegration: true,
    contextIsolation: false,
    // preload: path.join(__dirname, 'preload.js')
  }

})
mainWindow.on('close', function() {
});
mainWindow.on('unresponsive', () => {
  console.log('ERROR 61 - Window does not respond, let\'s quit')
  app.quit()
})

mainWindow.webContents.on('crashed', () => {
  console.log('ERROR 62 - Webcontent renderer crashed, let\'s quit')
  app.quit()
})

mainWindow.webContents.on('destroyed', () => {
  console.log('ERROR 63 - Webcontent destroyed, let\'s quit')
  app.quit()
})
mainWindow.loadURL(
  isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`
);

// Open the DevTools.

}

function createMenu(){

const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {  click (s){requireAction(s);}, type: 'normal', label: 'Save',accelerator: 'CommandOrControl+S'},
      {  click (s){openFile();}, type: 'normal', label: 'Open',accelerator: 'CommandOrControl+O' },
      { type: 'separator' },
      {
        label: 'Export As',
        submenu: [
          {  click (s){requireAction(s);}, type: 'normal', label: 'JPG', accelerator: 'CommandOrControl+Shift+E' },
          {  click (s){requireAction(s);}, type: 'normal', label: 'PNG', accelerator: 'CommandOrControl+E' }
        ]
      },
      { type: 'separator' },
      {
        label: 'Record GIF',
        submenu: [
          {  click (s){requireAction(s,"GIF");}, type: 'normal', label: 'Start' },
          {  click (s){requireAction(s,"GIF");}, type: 'normal', label: 'Stop' }
        ]
      },
      {
        label: 'Record WEBM',
        submenu: [
          {  click (s){requireAction(s,"WEBM");}, type: 'normal', label: 'Start' },
          {  click (s){requireAction(s,"WEBM");}, type: 'normal', label: 'Stop' }
        ]
      },
      { type: 'separator' },
      {  click (s){resetStorage()}, type: 'normal', label: 'Reset Patch',accelerator: process.platform === 'darwin' ? 'Alt+Cmd+R' : 'Alt+Shift+R'},
      {  click (s){randomPatch(true)}, type: 'normal', label: 'Random Patch', accelerator: 'CommandOrControl+N'},
      {  click (s){randomPatch(false)}, type: 'normal', label: 'True Random Patch', accelerator: 'CommandOrControl+Shift+N'},
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Render',
    submenu: [
      {  click (s){requireAction(s);}, type: 'normal', label: 'Play'},
      {  click (s){requireAction(s);}, type: 'normal', label: 'Pause' },
      {  click (s){requireAction(s);}, type: 'normal', label: 'Stop' },
      { type: 'separator' },
      {  click (s){requireOneFramejump();}, type: 'normal', label: 'Jump 1 Frame' },
      {  click (s){requireTenFramesjump(10);}, type: 'normal', label: 'Jump 10 Frames' },
      { type: 'separator' },
      {  click (s){requireRefresh();}, type: 'normal', label: 'Refresh' },
      {  click (s){requireAction(s);}, type: 'normal', label: 'Reseed' },
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'togglefullscreen' },
      { role: 'toggleDevTools' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      // { label: 'Toggle GUI', click (s){toggleGUI();}, type: 'normal',accelerator: 'Space'},
      { label: 'Show GUI', click (s){displayGUI(true);}, type: 'normal'},
      { label: 'Hide GUI', click (s){displayGUI(false);}, type: 'normal'},
      { type: 'separator' },
      // { label: 'Undock GUI',click (s){createGUI();}, type: 'normal', },
      // { label: 'Destroy GUI',click (s){destroyGUI();}, type: 'normal', },
      { label: 'Undock Render',click (s){createRender();}, type: 'normal', },
      { label: 'Destroy Render',click (s){destroyRender();}, type: 'normal', },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      { label: 'Open Documentation',click (s){createDoc();}, type: 'normal', }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
createMenu()
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
app.on('gpu-process-crashed', () => {
  console.log('ERROR 64 - App GPU process has crashed, let\'s quit')
  app.quit()
})

process.on('uncaughtException', function (err) {
  console.log('ERROR 60 - process thrown exception, let\'s quit')
  console.log(err)
app.quit()
})
})

app.on('window-all-closed', function () {
if (process.platform !== 'darwin') app.quit()
})
