function ACIDRENDER(storage,ipc,canvas,mothership){
  this.analytics = {
    msPerFrame: 0,
    frameTime: 0,
    fps: 0,
    fpsDisplay: document.getElementById("analyticsFPS"),
    widthDisplay: document.getElementById("analyticsWidth"),
    heightDisplay: document.getElementById("analyticsHeight")
  }
  this.storage = storage
  this.ipc = ipc
  this.canvas = canvas
  this.gl = this.canvas.getContext('webgl');
  this.mothership = mothership
  this.config = {}
  this.storage = storage
  this.count = 1000
  this.particles = [],
  this.upCount = function(){
    this.count += 1 / this.config.settings.framerate
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
        if(!this.initiated){
          this.render()
          this.initiated = true
        }
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
    this.analytics.widthDisplay.innerText = this.canvas.width
    this.analytics.heightDisplay.innerText = this.canvas.height
  }
  this.render = function(){
    if(!this.stopped){
      setTimeout(function () {
          requestAnimationFrame(function(){
            this.render()
          }.bind(this))
      }.bind(this), 60000 / (this.config.settings.framerate * 60));
    }
    this.analytics.msPerFrame = performance.now() - this.analytics.frameTime
    this.analytics.frameTime = performance.now()
    this.analytics.fps = Math.round(1000 / this.analytics.msPerFrame * 100) / 100
    this.analytics.fpsDisplay.innerText = this.analytics.fps


     //  gl = this.gl
     //  let colors = [];
     // let vertices = [];
     // var verticeN = 0
     // let d = (this.dimensions.width + this.dimensions.height) * 0.5
     // let resolution = 2 + this.config.render.resolution * 1000
     // let w = this.config.render.a < 0.5 ? resolution : resolution + (this.dimensions.width - resolution) * ((this.config.render.a - 0.5) * 2)
     // let h = this.config.render.a > 0.5 ? resolution : resolution + (this.dimensions.height - resolution) * (1 - (this.config.render.a * 2))
     // let subpixels = this.config.render.optimization.subpixels == "on"
     // for(let y = 0; y < this.dimensions.height; y+=h){
     //   for(let x = 0; x < this.dimensions.width; x+=w){
     //     let A = this.mothership.get(x,y,0,this.count)
     //     let B = this.mothership.get(x+w,y,0,this.count)
     //     let C = this.mothership.get(x,y+h,0,this.count)
     //     let D = this.mothership.get(x+w,y+h,0,this.count)
     //     let Ar = this.config.render.channels.r.active ? ((this.config.render.channels.r.base + A[0] * this.config.render.channels.r.mod) * this.config.render.channels.r.amp) % 1 : 0
     //     let Ag = this.config.render.channels.g.active ? ((this.config.render.channels.g.base + A[1] * this.config.render.channels.g.mod) * this.config.render.channels.g.amp) % 1 : 0
     //     let Ab = this.config.render.channels.b.active ? ((this.config.render.channels.b.base + A[2] * this.config.render.channels.b.mod) * this.config.render.channels.b.amp) % 1 : 0
     //     let Br = this.config.render.channels.r.active ? ((this.config.render.channels.r.base + B[0] * this.config.render.channels.r.mod) * this.config.render.channels.r.amp) % 1 : 0
     //     let Bg = this.config.render.channels.g.active ? ((this.config.render.channels.g.base + B[1] * this.config.render.channels.g.mod) * this.config.render.channels.g.amp) % 1 : 0
     //     let Bb = this.config.render.channels.b.active ? ((this.config.render.channels.b.base + B[2] * this.config.render.channels.b.mod) * this.config.render.channels.b.amp) % 1 : 0
     //     let Cr = this.config.render.channels.r.active ? ((this.config.render.channels.r.base + C[0] * this.config.render.channels.r.mod) * this.config.render.channels.r.amp) % 1 : 0
     //     let Cg = this.config.render.channels.g.active ? ((this.config.render.channels.g.base + C[1] * this.config.render.channels.g.mod) * this.config.render.channels.g.amp) % 1 : 0
     //     let Cb = this.config.render.channels.b.active ? ((this.config.render.channels.b.base + C[2] * this.config.render.channels.b.mod) * this.config.render.channels.b.amp) % 1 : 0
     //     let Dr = this.config.render.channels.r.active ? ((this.config.render.channels.r.base + D[0] * this.config.render.channels.r.mod) * this.config.render.channels.r.amp) % 1 : 0
     //     let Dg = this.config.render.channels.g.active ? ((this.config.render.channels.g.base + D[1] * this.config.render.channels.g.mod) * this.config.render.channels.g.amp) % 1 : 0
     //     let Db = this.config.render.channels.b.active ? ((this.config.render.channels.b.base + D[2] * this.config.render.channels.b.mod) * this.config.render.channels.b.amp) % 1 : 0
     //     // let gray = Math.floor(0.2126 * r + 0.7152 * g + 0.0722 * b)
     //     colors.push(Ar,Ag,Ab,Br,Bg,Bb,Cr,Cg,Cb,Br,Bg,Bb,Cr,Cg,Cb,Dr,Dg,Db)
     //     vertices.push((x / this.dimensions.width * 2) - 1,(y / this.dimensions.height * 2) - 1)
     //     vertices.push(((x + w) / this.dimensions.width * 2) - 1,(y / this.dimensions.height * 2) - 1)
     //     vertices.push((x / this.dimensions.width * 2) - 1,((y + h) / this.dimensions.height * 2) - 1)
     //     vertices.push(((x + w) / this.dimensions.width * 2) - 1,(y / this.dimensions.height * 2) - 1)
     //     vertices.push((x / this.dimensions.width * 2) - 1,((y + h) / this.dimensions.height * 2) - 1)
     //     vertices.push(((x + w) / this.dimensions.width * 2) - 1,((y + h) / this.dimensions.height * 2) - 1)
     //     verticeN+=6
     //   }
     // }
     // let colorBuffer = gl.createBuffer();
     // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
     // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
     // let aColor = gl.getAttribLocation(this.shaderProgram, 'aColor');
     // gl.vertexAttribPointer(aColor, 3  , gl.FLOAT, false, 0, 0);
     // gl.enableVertexAttribArray(aColor);
     // let vertex_buffer = gl.createBuffer();
     // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
     // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
     // let coord = gl.getAttribLocation(this.shaderProgram, "coord");
     // gl.vertexAttribPointer(coord, 2  , gl.FLOAT, false, 0, 0);
     // gl.enableVertexAttribArray(coord);
     // gl.clear(gl.COLOR_BUFFER_BIT);
     // gl.drawArrays(gl.TRIANGLES, 0, verticeN)
         gl = this.gl
         let colors = [];
        let vertices = [];
        var verticeN = 0
        let d = (this.dimensions.width + this.dimensions.height) * 0.5
        let res = 2 + this.config.render.resolution * 24
        gl.uniform1f(this.resolutionLocation, res + 0.1);
        let subpixels = this.config.render.optimization.subpixels == "on"
        let grayscale = this.config.render.a
        let ascii = ""
        for(let y = 0; y < this.dimensions.height; y+=res){
          for(let x = 0; x < this.dimensions.width; x+=res){
            let relX = x / this.dimensions.width // 0 - 1
            let centerX = 0.5
            let centeredRelX = relX <= centerX ? relX / centerX : 1- ((relX - centerX) / (1 - centerX))// 0 - 1 - 0
            let relY = y / this.dimensions.height // 0 - 1
            let centerY = 0.5
            let centeredRelY = relY <= centerY ? relY / centerY : 1 - ((relY - centerY) / (1 - centerY))// 0 - 1 - 0
            // let timeshift = (centeredRelX + centeredRelY) * 0.5
            let timeshift = Math.round((centeredRelX + centeredRelY) * 10) * 0.1
            // let timeshift = (Math.round(centeredRelX * 10) * 0.1 + Math.round(centeredRelY * 10) * 0.1) * 0.5
            // let timeshift = (Math.abs((x / this.dimensions.width * 2) - 1) + Math.abs((y / this.dimensions.height * 2) - 1)) * 0.5
            // timeshift = Math.sin(0.5 * timeshift)
            // timeshift = Math.round(timeshift * 10) * 0.1
            // timeshift = tmix * (1 - Math.sin(timeshift * 0.5 * Math.PI)) + (1-tmix) * timeshift
            // let shiftX = Math.round(y * 0.01) % 5 ? 100 : 0
            // let shiftY = Math.round(x * 0.01) % 3 ? 200 : 0
            let rgb = this.mothership.get(x,y,0,this.count + timeshift * 2) //multipy x and y for zoom and stretch, maybe rotate?
            let r = this.config.render.channels.r.active ? ((this.config.render.channels.r.base + rgb[0] * this.config.render.channels.r.mod) * this.config.render.channels.r.amp): 0
            let g = this.config.render.channels.g.active ? ((this.config.render.channels.g.base + rgb[1] * this.config.render.channels.g.mod) * this.config.render.channels.g.amp): 0
            let b = this.config.render.channels.b.active ? ((this.config.render.channels.b.base + rgb[2] * this.config.render.channels.b.mod) * this.config.render.channels.b.amp): 0
            let bw = (0.2126 * r + 0.7152 * g + 0.0722 * b)
            if(subpixels){
              colors.push(r * (1-grayscale) + bw * grayscale,0,0,0,g * (1-grayscale) + bw * grayscale,0,0,0,b * (1-grayscale) + bw * grayscale)
              vertices.push(
                (x / this.dimensions.width * 2) - 1,
                (y / this.dimensions.height * 2) - 1,
                (x / this.dimensions.width * 2) - 1,
                ((y + 0.33333333 * res) / this.dimensions.height * 2) - 1,
                (x / this.dimensions.width * 2) - 1,
                ((y + 0.66666666 * res) / this.dimensions.height * 2) - 1
              )
              verticeN+=3
            }
            else{
              colors.push(r * (1-grayscale) + bw * grayscale,g * (1-grayscale) + bw * grayscale,b * (1-grayscale) + bw * grayscale)
              vertices.push(
                (x / this.dimensions.width * 2) - 1,
                (y / this.dimensions.height * 2) - 1,
              )
              verticeN+=1
            }
          }
        }
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
