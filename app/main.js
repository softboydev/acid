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
  let data = "{\"fileCount\":15,\"frq\":0.1001001001001001,\"typ\":\"clp\",\"amp\":1,\"settings\":{\"defaultColor\":\"#ffffff\",\"defaultFx\":\"drv\",\"framerate\":\"10\",\"zoom\":0.2972972972972973,\"tips\":\"off\",\"labels\":\"on\",\"buttons\":\"on\",\"transparency\":0.5495495495495496},\"fx\":{\"c\":[],\"bit\":0,\"cmp\":0,\"exp\":0,\"rnd\":0,\"drv\":0,\"dpx\":0,\"bpx\":0,\"errv\":0,\"erro\":0},\"render\":{\"resolution\":0.4674674674674675,\"w\":0,\"h\":0,\"x\":0.01001001001001001,\"y\":0.01001001001001001,\"rad\":{\"tl\":0,\"tr\":0,\"br\":0,\"bl\":0,\"dtl\":0,\"dtr\":0,\"dbr\":0,\"dbl\":0},\"pad\":{\"n\":0,\"e\":0,\"s\":0,\"w\":0,\"dn\":0,\"de\":0,\"ds\":0,\"dw\":0},\"r\":0,\"bck\":\"#000000\",\"prm\":\"#ffffff\",\"clrs\":[\"#242829\",\"#ff0000\",\"#18c4e2\",\"#ff8800\",\"#fff700\",\"#0cb617\",\"#e6d6d6\"],\"sec\":{\"clr\":0,\"mod\":\"hsl\",\"bck\":\"#ff0000\",\"prm\":\"#0d15fd\",\"clrs\":[\"#ffffff\",\"#ce2c2c\",\"#000000\",\"#ffffff\"]},\"clr\":1,\"scl\":1,\"rot\":0,\"mod\":\"grd\",\"hsl\":true,\"eng\":\"s2d\"},\"osc\":[{\"typ\":\"prl\",\"min\":0,\"max\":0.4994994994994995,\"mix\":\"add\",\"run\":true,\"fx\":{\"c\":[],\"bit\":0,\"cmp\":0,\"exp\":0,\"rnd\":0,\"drv\":0},\"filter\":{\"lpf\":0,\"hpf\":0},\"config\":{\"x\":{\"frq\":0.4994994994994995,\"off\":0},\"y\":{\"frq\":0.08608608608608609,\"off\":0},\"z\":{\"frq\":0.1001001001001001,\"off\":0,\"len\":0.3029029029029029,\"mod\":0.7667667667667668,\"cen\":0.22422422422422422,\"shp\":0.16216216216216217}}},{\"typ\":\"osc\",\"min\":0,\"max\":0.4994994994994995,\"mix\":\"add\",\"run\":true,\"fx\":{\"c\":[],\"bit\":0,\"cmp\":0,\"exp\":0,\"rnd\":0,\"drv\":0},\"filter\":{\"lpf\":0,\"hpf\":0},\"config\":{\"x\":{\"frq\":0.5005005005005005,\"off\":0},\"y\":{\"frq\":0.5005005005005005,\"off\":0},\"z\":{\"frq\":0.07507507507507508,\"off\":0,\"len\":0.2,\"mod\":0.36236236236236236,\"cen\":0.22422422422422422,\"shp\":0.2962962962962963}}},{\"typ\":\"sin\",\"min\":0,\"max\":0.4994994994994995,\"mix\":\"add\",\"run\":true,\"fx\":{\"c\":[],\"bit\":0,\"cmp\":0,\"exp\":0,\"rnd\":0,\"drv\":0},\"filter\":{\"lpf\":0,\"hpf\":0},\"config\":{\"x\":{\"frq\":0.5005005005005005,\"off\":0},\"y\":{\"frq\":0.5005005005005005,\"off\":0},\"z\":{\"frq\":0.05305305305305305,\"off\":0,\"len\":0.2902902902902903,\"mod\":0,\"cen\":0.5325325325325325,\"shp\":0.2902902902902903}}},{\"typ\":\"off\",\"min\":0,\"max\":1,\"mix\":\"add\",\"run\":false,\"fx\":{\"c\":[],\"bit\":0,\"cmp\":0,\"exp\":0,\"rnd\":0,\"drv\":0},\"filter\":{\"lpf\":0,\"hpf\":0},\"config\":{\"x\":{\"frq\":0.5005005005005005,\"off\":0},\"y\":{\"frq\":0.5005005005005005,\"off\":0},\"z\":{\"frq\":0.5195195195195195,\"off\":0.8648648648648649,\"len\":0.17617617617617617,\"mod\":0.16016016016016016,\"cen\":0.5,\"shp\":0.5}}},{\"typ\":\"off\",\"min\":0,\"max\":1,\"mix\":\"add\",\"run\":false,\"fx\":{\"c\":[\"cmp\",\"rnd\",\"bit\",\"rnd\"],\"bit\":0,\"cmp\":0,\"exp\":0,\"rnd\":0,\"drv\":0},\"filter\":{\"lpf\":0,\"hpf\":0},\"config\":{\"x\":{\"frq\":0.5005005005005005,\"off\":0},\"y\":{\"frq\":0.5005005005005005,\"off\":0},\"z\":{\"frq\":0.4994994994994995,\"off\":0.4994994994994995,\"len\":0.4994994994994995,\"mod\":0.4994994994994995,\"cen\":0.1941941941941942,\"shp\":0.9479479479479479}}}]}"
  storage.set("config", data, function(error) {
    if (error){
      throw error
    }
    else{
      requireUpdate()
    }
  })
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
function requireOneFramejump(){
  mainWindow.webContents.send("requireOneFramejump");
}
function requireTenFramesjump(){
  mainWindow.webContents.send("requireTenFramesjump");
}
function requireRefresh(){
  mainWindow.webContents.send("requireRefresh");
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
    // frame: process.platform !== 'darwin',
    // skipTaskbar: process.platform === 'darwin',
    // autoHideMenuBar: process.platform === 'darwin',
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
      // frame: process.platform !== 'darwin',
      // skipTaskbar: process.platform === 'darwin',
      // autoHideMenuBar: process.platform === 'darwin',
      webPreferences: {
        devTools: true,
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
function destroyGUI () {
  if(guiWindow){
    guiWindow.close()
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
        {  click (s){requireOneFramejump();}, type: 'normal', label: 'Jump 1 Frame' },
        {  click (s){requireTenFramesjump(10);}, type: 'normal', label: 'Jump 10 Frames' },
        {  click (s){requireRefresh();}, type: 'normal', label: 'Refresh' },
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
        { label: 'Show GUI', click (s){displayGUI(true);}, type: 'normal', },
        { label: 'Hide GUI', click (s){displayGUI(false);}, type: 'normal', },
        { label: 'Undock GUI',click (s){createGUI();}, type: 'normal', },
        { label: 'Destroy GUI',click (s){destroyGUI();}, type: 'normal', },
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
