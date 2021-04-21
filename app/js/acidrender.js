function ACIDRENDER(storage,ipc,canvas,textlayer,mothership,env){
  this.analytics = {
    msPerFrame: 0,
    frameTime: 0,
    fps: 0,
    fpsDisplay: document.getElementById("analyticsFPS"),
    widthDisplay: document.getElementById("analyticsWidth"),
    heightDisplay: document.getElementById("analyticsHeight")
  }
  this.env = env
  this.storage = storage
  this.ipc = ipc
  this.canvas = canvas
  this.ascii = textlayer
  this.gl = this.canvas.getContext('webgl',{preserveDrawingBuffer: true});
  this.mothership = mothership
  this.config = {}
  this.storage = storage
  this.count = 1000
  this.particles = [],
  this.upCount = function(){
    this.count += this.env == "main" ? 1 / this.config.render.previewframerate : 1 / this.config.settings.framerate
    if(this.count > 2147483646){
      this.count = 1000
    }
  }
  this.initiated = false
  this.running = true
  this.stopped = false
  this.play = function(){
    if(this.stopped){
      this.stopped = false
      this.render()
    }
    this.running = true
  }
  this.pause = function(){
    this.running = false
  }
  this.stop = function(){
    this.running = false
    this.stopped = true
  }
  this.jump = function(n){
    if(!this.running){
      this.upCount()
      if(this.stopped){
        this.render()
      }
    }
  }
  this.refresh = function(){
    if(this.stopped){
      this.render()
    }
  }
  this.update = function(callback){
    this.storage.get("config", function(error, data) {
      if(error){
        throw error
      }
      else if(isNotEmptyObject(data)){
        this.config = JSON.parse(data)
        for(let c in this.config.render.clrs){
          this.config.render.clrs[c] = hexToRgb(this.config.render.clrs[c])
        }
        if(!this.initiated){
          this.render()
          this.initiated = true
        }
        this.refresh()
      }
    }.bind(this));
  }
  this.dimensions = {
    width: 0,
    height: 0
  }
  this.resize = function(){
    this.dimensions.width = window.innerWidth
    this.dimensions.height = window.innerHeight
    this.canvas.width = this.dimensions.width
    this.canvas.height = this.dimensions.height
    this.gl.viewport(0,0,this.canvas.width,canvas.height);
    if(env == "main"){
      this.analytics.widthDisplay.innerText = this.canvas.width
      this.analytics.heightDisplay.innerText = this.canvas.height
    }
  }
  this.render = function(){
    //RECURSIVE LOOP
    if(!this.stopped){
      let t = this.env == "main" ? 60000 / (this.config.render.previewframerate * 60) : 60000 / (this.config.settings.framerate * 60)
      setTimeout(function () {
          requestAnimationFrame(function(){
            this.render()
          }.bind(this))
      }.bind(this), t);
    }
    //ANALYTICS
    if(env == "main"){
      this.analytics.msPerFrame = performance.now() - this.analytics.frameTime
      this.analytics.frameTime = performance.now()
      this.analytics.fps = Math.round(1000 / this.analytics.msPerFrame * 100) / 100
      this.analytics.fpsDisplay.innerText = this.analytics.fps
    }
    //WEBGL GENERATION
     gl = this.gl
     let colors = []
    let vertices = []
    var verticeN = 0
    let height = this.dimensions.height
    let d = (this.dimensions.width + this.dimensions.height) * 0.5
    let res = this.env == "main" ? 2 + this.config.render.preview * 48 : 2 + this.config.render.resolution * 48
    gl.uniform1f(this.resolutionLocation, res + 0.1);
    let subpixels = this.config.render.optimization.subpixels == "on"
    let feedback = this.config.render.optimization.feedback == "on"
    let colormodes = this.config.render.optimization.colormodes == "on"
    let timeshiftQuantization = this.config.render.feedback.quantization != 0
    let grayscale = this.config.render.grayscale
    var y = 0
    var x = 0
    var r,g,b,a,rgb,bw,timeshift,relX,relY,centeredRelX,centeredRelX,n,m,isEdge,lShift,sShift,darken,q

    // var lastLine = -1
    // var currentLine = 0
    // var writeLine = false
    // var lastCell = -1
    // var currentCell = 0
    // var writeCell = 0
    // var asciiString = ""
    //
    // var upperLine = Math.floor(Math.floor(this.dimensions.height / this.config.render.ascii.fontsize) * 0.5 * this.config.render.ascii.spacing)
    // var lowerLine = Math.floor(this.dimensions.height / this.config.render.ascii.fontsize) - upperLine
    // var leftCell = Math.floor(Math.floor(this.dimensions.width / this.config.render.ascii.fontsize) * 0.5 * this.config.render.ascii.spacing)
    // var rightCell = Math.floor(this.dimensions.width / this.config.render.ascii.fontsize) - leftCell

    while(y < this.dimensions.height){
      // writeLine = false
      // writeCell = false
      // lastCell = -1
      // currentLine = Math.floor(y / this.config.render.ascii.fontsize)
      // if(currentLine > lastLine){
      //   lastLine = currentLine
      //   writeLine = true
      // }

      while(x < this.dimensions.width){
        // isEdge = false
        // if(writeLine){
        //   writeCell = false
        //   currentCell = Math.floor(x / this.config.render.ascii.fontsize)
        //   if(currentCell > lastCell){
        //     lastCell = currentCell
        //     writeCell = true
        //   }
        // }
        if(feedback){
          relX = x / this.dimensions.width // 0 - 1
          centeredRelX = relX <= this.config.render.feedback.centerX ? relX / this.config.render.feedback.centerX : 1- ((relX - this.config.render.feedback.centerX) / (1 - this.config.render.feedback.centerX))// 0 - 1 - 0
          relY = y / this.dimensions.height // 0 - 1
          centeredRelY = relY <= (1 - this.config.render.feedback.centerY) ? relY / (1 - this.config.render.feedback.centerY) : 1 - ((relY - (1 - this.config.render.feedback.centerY)) / this.config.render.feedback.centerY)// 0 - 1 - 0
          n = centeredRelX * this.config.render.feedback.skew + centeredRelY * (1 - this.config.render.feedback.skew)
          m = n * this.config.render.feedback.bend + this.config.render.feedback.mix * (1 - this.config.render.feedback.bend)
          lShift = centeredRelX * m + centeredRelY * (1 - m)
          sShift = Math.min(centeredRelX * m * 2, centeredRelY * (1 - m) * 2)
          timeshift = sShift * this.config.render.feedback.step + lShift * (1 - this.config.render.feedback.step)
          if(timeshiftQuantization){
            q = this.config.render.feedback.quantization * this.config.render.feedback.quantization
            timeshift = Math.round(timeshift * (1 / q)) * q//QUANTIZE
          }
          timeshift = 1 - timeshift
          darken = (timeshift * this.config.render.feedback.darken + (1 - this.config.render.feedback.darken)) * 0.99 + 0.01
          rgb = this.mothership.get(x,y,0,this.count + timeshift * this.config.render.feedback.intensity * 100)
          r = this.config.render.channels.r.active ? ((this.config.render.channels.r.base + rgb[0] * this.config.render.channels.r.mod) * this.config.render.channels.r.amp) * darken: 0
          g = this.config.render.channels.g.active ? ((this.config.render.channels.g.base + rgb[1] * this.config.render.channels.g.mod) * this.config.render.channels.g.amp) * darken: 0
          b = this.config.render.channels.b.active ? ((this.config.render.channels.b.base + rgb[2] * this.config.render.channels.b.mod) * this.config.render.channels.b.amp) * darken: 0
          a = this.config.render.channels.a.active ? ((this.config.render.channels.a.base + rgb[3] * this.config.render.channels.a.mod) * this.config.render.channels.a.amp) * darken: 0
        }
        else{
          rgb = this.mothership.get(x,y,0,this.count)
          r = this.config.render.channels.r.active ? ((this.config.render.channels.r.base + rgb[0] * this.config.render.channels.r.mod) * this.config.render.channels.r.amp): 0
          g = this.config.render.channels.g.active ? ((this.config.render.channels.g.base + rgb[1] * this.config.render.channels.g.mod) * this.config.render.channels.g.amp): 0
          b = this.config.render.channels.b.active ? ((this.config.render.channels.b.base + rgb[2] * this.config.render.channels.b.mod) * this.config.render.channels.b.amp): 0
          // a = this.config.render.channels.a.active ? ((this.config.render.channels.a.base + rgb[3] * this.config.render.channels.a.mod) * this.config.render.channels.a.amp): 0
        }
        bw = (0.2126 * r + 0.7152 * g + 0.0722 * b)
        // isEdge = !((Math.floor(bw * 100) * 0.1) % 1) && bw > 0.1 && bw < 0.9 && false
        // let bw = 1
        if(this.config.render.mod != "rgb" && colormodes){
          switch(this.config.render.mod){
            case "ndx":
              let c = this.config.render.clrs[Math.min(Math.floor(this.config.render.clrs.length * bw),(this.config.render.clrs.length - 1))] || {r:0,g:0,b:0}
              r = c.r
              g = c.g
              b = c.b
              break
            case "grd":
              let start = this.config.render.clrs[Math.min(Math.floor(this.config.render.clrs.length * bw),(this.config.render.clrs.length - 1))] || {r:0,g:0,b:0}
              let end = this.config.render.clrs[Math.min(Math.ceil(this.config.render.clrs.length * bw),(this.config.render.clrs.length - 1))] || {r:1,g:1,b:1}
              let colorMix = (bw * this.config.render.clrs.length) % 1
              r = start.r * (1 - colorMix) + end.r * colorMix
              g = start.g * (1 - colorMix) + end.g * colorMix
              b = start.b * (1 - colorMix) + end.b * colorMix
              break
          }
        }
        // if(subpixels && !isEdge){
        if(subpixels){
          colors.push(r * (1-grayscale) + bw * grayscale,this.config.render.burn,this.config.render.burn,this.config.render.burn,g * (1-grayscale) + bw * grayscale,this.config.render.burn,this.config.render.burn,this.config.render.burn,b * (1-grayscale) + bw * grayscale)
          vertices.push((x / this.dimensions.width * 2) - 1,-((y / this.dimensions.height * 2) - 1),(x / this.dimensions.width * 2) - 1,-(((y + 0.33333333 * res) / this.dimensions.height * 2) - 1),(x / this.dimensions.width * 2) - 1,-(((y + 0.66666666 * res) / this.dimensions.height * 2) - 1))
          verticeN+=3
        }
        else{
          // if(isEdge){
          //   colors.push(1,0,0)
          // }
          // else{
            colors.push(r * (1-grayscale) + bw * grayscale,g * (1-grayscale) + bw * grayscale,b * (1-grayscale) + bw * grayscale)
          // }
          vertices.push(
            ((x / this.dimensions.width * 2) - 1),
            -((y / this.dimensions.height * 2) - 1),
          )
          verticeN+=1
        }
        // if(writeCell && (currentLine >= upperLine) && (currentLine <= lowerLine) && (currentCell >= leftCell) && (currentCell <= rightCell)){
        //   let char = Math.floor(a * this.config.render.ascii.chars.length) || 0
        //   char = char > (this.config.render.ascii.chars.length - 1) ? (this.config.render.ascii.chars.length - 1) : char
        //   asciiString += this.config.render.ascii.chars.charAt(char)
        // }
        x+=res
      }
      x = 0
      y += res
      // if(writeLine){
      //   asciiString += "<br>"
      // }
    }
    //WEBGL RENDER
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    let aColor = gl.getAttribLocation(this.shaderProgram, 'aColor');
    gl.vertexAttribPointer(aColor, 3  , gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);
    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let coord = gl.getAttribLocation(this.shaderProgram, "coord");
    gl.vertexAttribPointer(coord, 2  , gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, verticeN)
    //ASCII RENDER
    // this.ascii.innerHTML = asciiString
    //UPCOUNT
    if(this.running){
      this.upCount()
      this.mothership.canvasCapturerer.requestGifFrame(60000 / (this.config.settings.framerate * 60))
    }
  }
  this.init = function(){
    let gl = this.gl
    gl.clearColor(0,0,0,1);

   let vertCode =
      'attribute vec4 coord;'+
      'attribute vec4 aColor;'+
      'varying vec4 vColor;'+
      'uniform float resolution;'+


      'void main(void) {'+
        'gl_Position = coord;'+
        'gl_PointSize = resolution;'+
        'vColor = aColor;'+
      '}'
  let vertShader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(vertShader, vertCode);
   gl.compileShader(vertShader);
   let fragCode =
   'precision mediump float;'+

  'varying vec4 vColor;'+

    'void main() {'+
    'gl_FragColor = vColor;'+
    '}'
   let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
   gl.shaderSource(fragShader, fragCode);
   gl.compileShader(fragShader);
   let shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertShader);
   gl.attachShader(shaderProgram, fragShader);
   gl.linkProgram(shaderProgram);
   gl.useProgram(shaderProgram);
   this.shaderProgram = shaderProgram
   this.resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
    this.ipc.on("requireUpdate", function () {
      this.update()
    }.bind(this));
    this.ipc.on("requirePause", function () {
      this.pause()
    }.bind(this));
    this.ipc.on("requirePlay", function () {
      this.play()
    }.bind(this));
    this.ipc.on("requireStop", function () {
      this.stop()
    }.bind(this));
    this.ipc.on("requireOneFramejump", function () {
      this.jump(1)
    }.bind(this));
    this.ipc.on("requireRefresh", function () {
      this.refresh()
    }.bind(this));
    this.ipc.on("requireTenFramesjump", function () {
      this.jump(10)
    }.bind(this));
    window.addEventListener("resize",function(){
      this.resize()
    }.bind(this))
    this.resize()
    this.update()
  }
  this.init()
}
