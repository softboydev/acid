  // window.config =

// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
const storage = require('electron-json-storage');

let mainWindow
let guiWindow
let renderWindow
let docWindow

ipcMain.on('requestUpdate', (event) => {
    requireUpdate()
})
function requireUpdate(){
  mainWindow.webContents.send("requireUpdate");
  if(guiWindow){
    guiWindow.webContents.send("requireUpdate");
  }
  if(renderWindow){
    renderWindow.webContents.send("requireUpdate");
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
  let data = "{\"typ\":\"mod\",\"settings\":{\"defaultColor\":\"#ffffff\",\"defaultFx\":\"drv\",\"framerate\":\"10\",\"zoom\":0.2972972972972973,\"tips\":\"off\",\"labels\":\"on\",\"buttons\":\"on\",\"transparency\":0.5495495495495496},\"render\":{\"resolution\":0.3,\"preview\":0.3,\"previewframerate\":10,\"grayscale\":0.5,\"mod\":\"rgb\",\"burn\":0,\"clrs\":[],\"optimization\":{\"effects\":\"on\",\"subpixels\":\"on\",\"feedback\":\"on\",\"colormodes\":\"on\"},\"feedback\":{\"quantization\":0,\"intensity\":0,\"mix\":0.5,\"bend\":1,\"skew\":0.8,\"centerY\":0.5,\"centerX\":0.5,\"step\":0.5,\"darken\":0.5},\"channels\":{\"r\":{\"amp\":1,\"base\":0,\"mod\":1,\"active\":true},\"g\":{\"amp\":1,\"base\":0,\"mod\":1,\"active\":true},\"b\":{\"amp\":1,\"base\":0,\"mod\":1,\"active\":true},\"a\":{\"amp\":1,\"base\":0,\"mod\":1,\"active\":true}}},\"osc\":[{\"typ\":\"sin\",\"min\":0,\"max\":0.6676676676676677,\"mix\":\"add\",\"run\":true,\"fx\":{\"c\":[\"exp\",\"rnd\",\"bit\"],\"bit\":0.9009009009009009,\"cmp\":0,\"exp\":0.6846846846846847,\"rnd\":0.03903903903903904,\"drv\":0},\"filter\":{\"lpf\":0,\"hpf\":0},\"config\":{\"x\":{\"frq\":0.4994994994994995,\"off\":0},\"y\":{\"frq\":0.08608608608608609,\"off\":0},\"z\":{\"frq\":0.028028028028028028,\"off\":0,\"len\":0.16216216216216217,\"mod\":0.07307307307307308,\"cen\":0.22422422422422422,\"shp\":0.16216216216216217}},\"channels\":{\"r\":1,\"g\":1,\"b\":1,\"a\":1}},{\"typ\":\"prl\",\"min\":0,\"max\":0.6476476476476476,\"mix\":\"mlt\",\"run\":true,\"fx\":{\"c\":[\"exp\",\"drv\"],\"bit\":0,\"cmp\":0.7107107107107107,\"exp\":0.4174174174174174,\"rnd\":0,\"drv\":0.5555555555555556},\"filter\":{\"lpf\":0,\"hpf\":0},\"config\":{\"x\":{\"frq\":0.1891891891891892,\"off\":0.4994994994994995},\"y\":{\"frq\":0.19519519519519518,\"off\":0.4994994994994995},\"z\":{\"frq\":0.35235235235235235,\"off\":0,\"len\":0.5,\"mod\":0.36236236236236236,\"cen\":0.22422422422422422,\"shp\":0.2962962962962963}},\"channels\":{\"r\":1,\"g\":1,\"b\":1,\"a\":1}},{\"typ\":\"osc\",\"min\":0.44744744744744747,\"max\":1,\"mix\":\"div\",\"run\":true,\"fx\":{\"c\":[\"cmp\"],\"bit\":0,\"cmp\":0.7567567567567568,\"exp\":0,\"rnd\":0,\"drv\":0},\"filter\":{\"lpf\":0,\"hpf\":0},\"config\":{\"x\":{\"frq\":0.5005005005005005,\"off\":0},\"y\":{\"frq\":0.5005005005005005,\"off\":0},\"z\":{\"frq\":0.026026026026026026,\"off\":0,\"len\":0.12512512512512514,\"mod\":0.3023023023023023,\"cen\":0.7387387387387387,\"shp\":0.2902902902902903}},\"channels\":{\"r\":1,\"g\":1,\"b\":1,\"a\":1}},{\"typ\":\"plx\",\"min\":0,\"max\":0.21021021021021022,\"mix\":\"add\",\"run\":true,\"fx\":{\"c\":[\"exp\",\"rnd\"],\"bit\":0,\"cmp\":0,\"exp\":0.8588588588588588,\"rnd\":0.12112112112112113,\"drv\":0},\"filter\":{\"lpf\":0,\"hpf\":0.18018018018018017},\"config\":{\"x\":{\"frq\":0.5005005005005005,\"off\":0.4994994994994995},\"y\":{\"frq\":0.07807807807807808,\"off\":1},\"z\":{\"frq\":0.5195195195195195,\"off\":0.8648648648648649,\"len\":0.17617617617617617,\"mod\":0.16016016016016016,\"cen\":0.5,\"shp\":0.5}},\"channels\":{\"r\":1,\"g\":1,\"b\":1,\"a\":1}},{\"typ\":\"osc\",\"min\":0.43743743743743746,\"max\":0.9819819819819819,\"mix\":\"div\",\"run\":true,\"fx\":{\"c\":[],\"bit\":0,\"cmp\":0,\"exp\":0,\"rnd\":0,\"drv\":0},\"filter\":{\"lpf\":0,\"hpf\":0},\"config\":{\"x\":{\"frq\":0.5005005005005005,\"off\":0},\"y\":{\"frq\":0.5005005005005005,\"off\":0},\"z\":{\"frq\":0,\"off\":0.4994994994994995,\"len\":0.8818818818818819,\"mod\":0,\"cen\":0.8308308308308309,\"shp\":0.7907907907907908}},\"channels\":{\"r\":1,\"g\":1,\"b\":1,\"a\":1}}]}"
  storage.set("config", data, function(error) {
    if (error){
      throw error
    }
    else{
      requireUpdate()
    }
  })
}
function randomPatch(save){
  let config = {}
  storage.get("config", function(error, data) {
    if(error){
      throw error
    }
    else{
      config = JSON.parse(data)
      let oscTypes = ["off","prl","plx","org","osc","sqr","pwm","saw","tri","sin"]
      let mixTypes = ["add","sub","mlt","div"]
      // let colorModes = ["rgb","grd","ndx"]
      let fxTypes = ["drv","cmp","exp","rnd","bit"]
      // let generateRandomColors = function(n){
      //   let target = Math.floor(Math.random() * n)
      //   let pool = []
      //   for(let i = 0; i < target; i++){
      //     pool.push("#" + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6))
      //   }
      //   return pool
      // }
      let generateRandomFx = function(n){
        let target = Math.floor(Math.random() * n)
        let pool = []
        for(let i = 0; i < target; i++){
          pool.push(fxTypes[Math.floor(Math.random() * 0.99 * fxTypes.length)])
        }
        return pool
      }
      let newData = {
            typ: config.typ,
            settings: config.settings,
            render: {
              resolution: config.render.resolution,
              preview: config.render.preview,
              previewframerate: config.render.previewframerate,
              grayscale: config.render.grayscale,
              mod: config.render.mod,
              burn: config.render.burn,
              clrs:config.render.clrs,
              optimization: {
                effects: config.render.optimization.effects,
                subpixels: config.render.optimization.subpixels,
                feedback: config.render.optimization.feedback,
                colormodes: config.render.optimization.colormodes
              },
              feedback: {
                quantization: Math.random(),
                intensity: Math.random(),
                mix: Math.random(),
                bend: Math.random(),
                skew: Math.random(),
                centerY: Math.random(),
                centerX: Math.random(),
                step: Math.random(),
                darken: Math.random()
              },
              channels: config.render.channels
            },
            osc: [
              {
                typ: oscTypes[Math.floor(Math.random() * 0.99 * oscTypes.length)],
                min: save ? 0.5 * Math.random() : Math.random(),
                max: save ? 0.5 + Math.random() * 0.5 : Math.random(),
                mix: save ? "add" : mixTypes[Math.floor(Math.random() * 0.99 * mixTypes.length)],
                run: true,
                fx: {
                  c: generateRandomFx(3),
                  bit: Math.random(),
                  cmp: Math.random(),
                  exp: Math.random(),
                  rnd: Math.random(),
                  drv: Math.random()
                },
                filter: {
                  lpf: save ? 0.8 * Math.random() : Math.random(),
                  hpf: save ? 0.8 * Math.random() : Math.random()
                },
                config: {
                  x: {
                    frq: save ? Math.random() * 0.1 : Math.random(),
                    off: Math.random()
                  },
                  y: {
                    frq: save ? Math.random() * 0.1 : Math.random(),
                    off: Math.random()
                  },
                  z: {
                    frq: save ? Math.random() * 0.1 : Math.random(),
                    off: Math.random(),
                    len: save ? Math.random() * 0.4 : Math.random(),
                    mod: Math.random(),
                    cen: Math.random(),
                    shp: Math.random()
                  }
                },
                channels: {
                  r: Math.random(),
                  g: Math.random(),
                  b: Math.random(),
                  a: Math.random()
                }
              },
              {
                typ: oscTypes[Math.floor(Math.random() * 0.99 * oscTypes.length)],
                min: 0.5 * Math.random(),
                max: 0.5 + Math.random() * 0.5,
                mix: save ? "add" : mixTypes[Math.floor(Math.random() * 0.99 * mixTypes.length)],
                run: true,
                fx: {
                  c: generateRandomFx(3),
                  bit: Math.random(),
                  cmp: Math.random(),
                  exp: Math.random(),
                  rnd: Math.random(),
                  drv: Math.random()
                },
                filter: {
                  lpf: 0.8 * Math.random(),
                  hpf: 0.8 * Math.random()
                },
                config: {
                  x: {
                    frq: Math.random() * 0.1,
                    off: Math.random()
                  },
                  y: {
                    frq: Math.random() * 0.1,
                    off: Math.random()
                  },
                  z: {
                    frq: Math.random() * 0.1,
                    off: Math.random(),
                    len: Math.random() * 0.4,
                    mod: Math.random(),
                    cen: Math.random(),
                    shp: Math.random()
                  }
                },
                channels: {
                  r: Math.random(),
                  g: Math.random(),
                  b: Math.random(),
                  a: Math.random()
                }
              },
              {
                typ: oscTypes[Math.floor(Math.random() * 0.99 * oscTypes.length)],
                min: 0.5 * Math.random(),
                max: 0.5 + Math.random() * 0.5,
                mix: save ? "add" : mixTypes[Math.floor(Math.random() * 0.99 * mixTypes.length)],
                run: true,
                fx: {
                  c: generateRandomFx(3),
                  bit: Math.random(),
                  cmp: Math.random(),
                  exp: Math.random(),
                  rnd: Math.random(),
                  drv: Math.random()
                },
                filter: {
                  lpf: 0.8 * Math.random(),
                  hpf: 0.8 * Math.random()
                },
                config: {
                  x: {
                    frq: Math.random() * 0.1,
                    off: Math.random()
                  },
                  y: {
                    frq: Math.random() * 0.1,
                    off: Math.random()
                  },
                  z: {
                    frq: Math.random() * 0.1,
                    off: Math.random(),
                    len: Math.random() * 0.4,
                    mod: Math.random(),
                    cen: Math.random(),
                    shp: Math.random()
                  }
                },
                channels: {
                  r: Math.random(),
                  g: Math.random(),
                  b: Math.random(),
                  a: Math.random()
                }
              },
              {
                typ: oscTypes[Math.floor(Math.random() * 0.99 * oscTypes.length)],
                min: 0.5 * Math.random(),
                max: 0.5 + Math.random() * 0.5,
                mix: save ? "add" : mixTypes[Math.floor(Math.random() * 0.99 * mixTypes.length)],
                run: true,
                fx: {
                  c: generateRandomFx(3),
                  bit: Math.random(),
                  cmp: Math.random(),
                  exp: Math.random(),
                  rnd: Math.random(),
                  drv: Math.random()
                },
                filter: {
                  lpf: 0.8 * Math.random(),
                  hpf: 0.8 * Math.random()
                },
                config: {
                  x: {
                    frq: Math.random() * 0.1,
                    off: Math.random()
                  },
                  y: {
                    frq: Math.random() * 0.1,
                    off: Math.random()
                  },
                  z: {
                    frq: Math.random() * 0.1,
                    off: Math.random(),
                    len: Math.random() * 0.4,
                    mod: Math.random(),
                    cen: Math.random(),
                    shp: Math.random()
                  }
                },
                channels: {
                  r: Math.random(),
                  g: Math.random(),
                  b: Math.random(),
                  a: Math.random()
                }
              },
              {
                typ: oscTypes[Math.floor(Math.random() * 0.99 * oscTypes.length)],
                min: 0.5 * Math.random(),
                max: 0.5 + Math.random() * 0.5,
                mix: save ? "add" : mixTypes[Math.floor(Math.random() * 0.99 * mixTypes.length)],
                run: true,
                fx: {
                  c: generateRandomFx(3),
                  bit: Math.random(),
                  cmp: Math.random(),
                  exp: Math.random(),
                  rnd: Math.random(),
                  drv: Math.random()
                },
                filter: {
                  lpf: 0.8 * Math.random(),
                  hpf: 0.8 * Math.random()
                },
                config: {
                  x: {
                    frq: Math.random() * 0.1,
                    off: Math.random()
                  },
                  y: {
                    frq: Math.random() * 0.1,
                    off: Math.random()
                  },
                  z: {
                    frq: Math.random() * 0.1,
                    off: Math.random(),
                    len: Math.random() * 0.4,
                    mod: Math.random(),
                    cen: Math.random(),
                    shp: Math.random()
                  }
                },
                channels: {
                  r: Math.random(),
                  g: Math.random(),
                  b: Math.random(),
                  a: Math.random()
                }
              }
            ]
          }
      newData = JSON.stringify(newData)
      storage.set("config", newData, function(error) {
        if (error){
          throw error
        }
        else{
          requireUpdate()
        }
      })
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
function toggleGUI(){
  mainWindow.webContents.send("requireToggleGUI");
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
function createRender () {
  if(!renderWindow){
    renderWindow = new BrowserWindow({
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
    renderWindow.on('close', function() {
      renderWindow = false
    });
    renderWindow.loadFile('html/render.html')
  }
}
function destroyRender () {
  if(renderWindow){
    renderWindow.close()
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
        { label: 'Toggle GUI', click (s){toggleGUI();}, type: 'normal',accelerator: 'Space'},
        { label: 'Show GUI', click (s){displayGUI(true);}, type: 'normal'},
        { label: 'Hide GUI', click (s){displayGUI(false);}, type: 'normal'},
        { type: 'separator' },
        { label: 'Undock GUI',click (s){createGUI();}, type: 'normal', },
        { label: 'Destroy GUI',click (s){destroyGUI();}, type: 'normal', },
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
