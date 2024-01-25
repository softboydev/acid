export function AcidRender(canvas,wrapper){
  this.wrapper = wrapper
  this.canvas = canvas
  this.data = {
    msPerFrame: 0,
    frameTime: 0,
    fps: 0,
    width: 0,
    height: 0,
    frame: 1000
  }
  this.gl = this.canvas.getContext('webgl',{preserveDrawingBuffer: true});
  this.acid = acid
  this.particles = [],
  this.nextframe = function(){
    this.data.frame += 1
    if(this.data.frame > 2147483646){
      this.data.frame = 1000
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
  this.pause = function(){ //public, called to pause
    this.running = false
  }
  this.stop = function(){ //public, called to stop
    this.running = false
    this.stopped = true
  }
  this.jump = function(n){
    this.data.frame += n
    this.data.frame = this.data.frame < 0 ? 0 : this.data.frame
    this.refresh()
  }
  this.refresh = function(force){ //makes a conditional rerender
    if(this.stopped || force){
      this.render()
    }
  }
  this.resize = function(){ //called by window resize event
    this.data.width = window.innerWidth
    this.data.height = window.innerHeight
    this.canvas.width = this.data.width
    this.canvas.height = this.data.height
    this.gl.viewport(0,0,this.canvas.width,canvas.height)
    this.refresh(true)
  }
  this.render = function(){
    //RECURSIVE LOOP
    if(!this.stopped){
      let t = 100 //framerate
      setTimeout(function () {
          requestAnimationFrame(function(){
            this.render()
          }.bind(this))
      }.bind(this), t);
    }
    //ANALYTICS
    this.data.msPerFrame = performance.now() - this.data.frameTime
    this.data.frameTime = performance.now()
    this.data.fps = Math.round(1000 / this.data.msPerFrame * 100) / 100
    //WEBGL GENERATION
    let gl = this.gl
    let colors = []
    let vertices = []
    var verticeN = 0
    let height = this.data.height
    let d = (this.data.width + this.data.height) * 0.5
    let res = 48 //resolution
    gl.uniform1f(this.resolutionLocation, res + 0.1);
    let subpixels = false
    let feedback = false
    let colormodes = false
    let timeshiftQuantization = false
    let y = 0
    let x = 0
    let r,g,b,a,rgb,bw,timeshift,relX,relY,centeredRelX,centeredRelX,n,m,isEdge,lShift,sShift,darken,q, mono
    while(y < this.data.height){
      while(x < this.data.width){
        let shift = 0
        if(feedback){
          relX = x / this.data.width // 0 - 1
          centeredRelX = relX <= this.config.render.feedback.centerX ? relX / this.config.render.feedback.centerX : 1- ((relX - this.config.render.feedback.centerX) / (1 - this.config.render.feedback.centerX))// 0 - 1 - 0
          relY = y / this.data.height // 0 - 1
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
          shift = timeshift * this.config.render.feedback.intensity * 100)
        }
        let r,g,b = this.wrapper.get(x,y,this.data.frame + shift)
        bw = (0.2126 * r + 0.7152 * g + 0.0722 * b)
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
        if(subpixels){
          colors.push(r * (1-grayscale) + bw * grayscale,this.config.render.burn,this.config.render.burn,this.config.render.burn,g * (1-grayscale) + bw * grayscale,this.config.render.burn,this.config.render.burn,this.config.render.burn,b * (1-grayscale) + bw * grayscale)
          vertices.push((x / this.data.width * 2) - 1,-((y / this.data.height * 2) - 1),(x / this.data.width * 2) - 1,-(((y + 0.33333333 * res) / this.data.height * 2) - 1),(x / this.data.width * 2) - 1,-(((y + 0.66666666 * res) / this.data.height * 2) - 1))
          verticeN+=3
        }
        else{
          colors.push(r * (1-grayscale) + bw * grayscale,g * (1-grayscale) + bw * grayscale,b * (1-grayscale) + bw * grayscale)
          vertices.push(
            ((x / this.data.width * 2) - 1),
            -((y / this.data.height * 2) - 1)
          )
          verticeN+=1
        }
        x += res
      }
      x = 0
      y += res
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
    //UPCOUNT
    if(this.running){
      this.nextframe()
      // this.wrapper.canvasCapturerer.requestGifFrame(60000 / (this.config.settings.framerate * 60))
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
   this.resize()
  }
  this.init()
}
