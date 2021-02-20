// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
const storage = require('electron-json-storage');

let mainWindow
let guiWindow
let docWindow

ipcMain.on('requestUpdate', (event) => {
    requireUpdate()
})
function requireUpdate(){
  mainWindow.webContents.send("requireUpdate");
  if(guiWindow){
    guiWindow.webContents.send("requireUpdate");
  }
}
function checkForEmptyStorage(){
  storage.get("config", function(error, data) {
    if(error){
      throw error
    }
    else if(!isNotEmptyObject(data)){
      resetStorage()
    }
  })
  function isNotEmptyObject(obj){
    return !(obj && Object.keys(obj).length === 0 && obj.constructor === Object)
  }
}
function resetStorage(){
  fs.readFile('./default.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    else{
      storage.set("config", data, function(error) {
        if (error){
          throw error
        }
        else{
          requireUpdate()
        }
      })
    }
  });


}
function displayGUI(flag){
  if(flag){
    mainWindow.webContents.send("requireShowGUI");
  }
  else{
    mainWindow.webContents.send("requireHideGUI");
  }
}
function requireAction(sender,prefix){
  prefix = prefix || ""
  mainWindow.webContents.send("require" + prefix + sender.label);
}
function requireFramejump(){
  mainWindow.webContents.send("requireFramejump");
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
    icon: path.join(__dirname, { darwin: 'icon.icns', linux: 'icon.png', win32: 'icon.ico' }[process.platform] || 'icon.ico'),
    frame: process.platform !== 'darwin',
    skipTaskbar: process.platform === 'darwin',
    autoHideMenuBar: process.platform === 'darwin',
    webPreferences: {
      devTools: true,
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.on('close', function() {
    if(guiWindow){
      guiWindow.close()
    }
    if(docWindow){
      docWindow.close()
    }
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
  mainWindow.loadFile('index.html')
}
function createGUI () {
  if(!guiWindow){
    guiWindow = new BrowserWindow({
      width: 800,
      height: 400,
      backgroundColor: '#000000',
      icon: path.join(__dirname, { darwin: 'icon.icns', linux: 'icon.png', win32: 'icon.ico' }[process.platform] || 'icon.ico'),
      frame: process.platform !== 'darwin',
      skipTaskbar: process.platform === 'darwin',
      autoHideMenuBar: process.platform === 'darwin',
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, 'preload.js')
      }
    })
    guiWindow.on('close', function() {
      guiWindow = false
    });
    guiWindow.loadFile('html/gui.html')
  }
}
function createDoc() {
  if(!docWindow){
    docWindow = new BrowserWindow({
      width: 600,
      height: 800,
      backgroundColor: '#000000',
      icon: path.join(__dirname, { darwin: 'icon.icns', linux: 'icon.png', win32: 'icon.ico' }[process.platform] || 'icon.ico'),
      webPreferences: {
        devTools: false,
        enableRemoteModule: false,
        nodeIntegration: false,
        contextIsolation: true
      }
    })
    docWindow.on('close', function() {
      docWindow = false
    });
    docWindow.loadFile('html/readme.html')
  }
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
        {  click (s){requireAction(s);}, type: 'normal', label: 'Save' },
        {  click (s){openFile();}, type: 'normal', label: 'Open' },
        { type: 'separator' },
        {
          label: 'Export As',
          submenu: [
            {  click (s){requireAction(s);}, type: 'normal', label: 'JPG' },
            {  click (s){requireAction(s);}, type: 'normal', label: 'PNG' }
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
        { type: 'separator' },
        {  click (s){resetStorage()}, type: 'normal', label: 'Reset Patch' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Render',
      submenu: [
        {  click (s){requireAction(s);}, type: 'normal', label: 'Play' },
        {  click (s){requireAction(s);}, type: 'normal', label: 'Pause' },
        {  click (s){requireAction(s);}, type: 'normal', label: 'Stop' },
        {  click (s){requireFramejump();}, type: 'normal', label: 'Jump Frame' },
        { type: 'separator' },
        {  click (s){requireAction(s);}, type: 'normal', label: 'Reseed' },
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { label: 'Open GUI', click (s){displayGUI(true);}, type: 'normal', },
        { label: 'Close GUI', click (s){displayGUI(false);}, type: 'normal', },
        { label: 'Undock GUI',click (s){createGUI();}, type: 'normal', },
        { type: 'separator' },
        { label: 'Open Documentation',click (s){createDoc();}, type: 'normal', },
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
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  checkForEmptyStorage()
  createMenu()
  createWindow()
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
