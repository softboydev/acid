function ACID(storage,ipc,canvas){
  this.storage = storage
  this.ipc = ipc
  this.config = {}
  this.seed = 0
  this.canvas = canvas
  this.initiated = false
  this.canvasCapturerer = {
    requestGifFrame: function(delay){
      if(this.canvasCapturerer.addFrames){
        this.canvasCapturerer.gif.addFrame(this.canvas, {delay: delay});
      }
    }.bind(this)
  }
  this.export = function(fileType,capture){
    if(capture){
      switch(fileType){
        case "webm":
          if(this.canvasCapturerer.recorder){
            this.canvasCapturerer.recorder.stop()
            this.toggleRecorderUI(false)
            this.toggleExporterUI(true)
            this.canvasCapturerer.recorder.save(this.getExportFilename("webm"))
            this.toggleExporterUI(false)
            this.config.fileCount = this.config.fileCount + 1
            this.save()
            this.canvasCapturerer.recorder = false
            this.exporting = false
          }
          break
        case "gif":
          this.canvasCapturerer.addFrames = false
          this.toggleRecorderUI(false)
          this.toggleExporterUI(true)
          this.canvasCapturerer.gif.on('finished', function(blob) {
            this.download(blob,this.getExportFilename("gif"),true)
            this.canvasCapturerer.gif = false
            this.toggleExporterUI(false)
          }.bind(this));
          this.canvasCapturerer.gif.render();

          break;
      }
    }
    else if(!this.exporting){
      this.exporting = true
      switch(fileType){
        case "jpg":
          this.canvas.toBlob(function(blob) {
            this.download(blob,this.getExportFilename("jpg"),true)
          }.bind(this),'image/jpeg', 0.95)
          break
        case "png":
          this.canvas.toBlob(function(blob) {
            this.download(blob,this.getExportFilename("png"),true)
          }.bind(this),'image/png')
          break
        case "webm":
          this.toggleRecorderUI(true)
          this.canvasCapturerer.recorder = new CanvasRecorder(this.canvas)
          this.canvasCapturerer.recorder.start()
          break
        case "gif":
          this.toggleRecorderUI(true)
          this.canvasCapturerer.gif = new GIF({
            workers: 2,
            quality: 10,
            workerScript: "./js/gif.worker.js"
          });
          this.canvasCapturerer.addFrames = true
          break

      }
    }
  }
  this.getExportFilename = function(type){
    // return this.config.fileCount.toString().padStart(8, '0') + "." + type;
    return "acid." + type;
  }
  this.download = function(blob,name,isexport){
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    if(isexport){
      this.exporting = false
      this.config.fileCount = this.config.fileCount + 1
      this.save()
    }
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
  }
  this.store = function(){
    let blob = new Blob([JSON.stringify(this.config)], {type: 'text/plain'});
    this.download(blob,"config.txt",false)
  }
  this.save = function(){
    this.storage.set("config", JSON.stringify(this.config), function(error) {
      if (error){
        throw error
      }
      else{
        this.ipc.send("requestUpdate","");
      }
    }.bind(this));
  }
  this.exporting = false
  this.t = 0
  this.dynamics = {
    t: 0,
    d: 0
  }
  this.reseed = function(){
    this.seed = Math.random() * 1000
    noise.seed(Math.random() * 1000)
  }
  this.toggleRecorderUI = function(flag){
    if(flag){
      document.body.classList.add("recorder-active")
    }
    else {
      document.body.classList.remove("recorder-active")
    }
  }
  this.toggleExporterUI = function(flag){
    if(flag){
      document.body.classList.add("export-active")
    }
    else {
      document.body.classList.remove("export-active")
    }
  }
  this.createRender = function(){
    new ACIDRENDER(this.storage,this.ipc,this.canvas,this)
  }
  this.fx = {
    exp: function(n,i){
      return Math.pow(n,1 + i)
    }.bind(this),
    cmp: function(n,i){
      return Math.pow(n,1 - i)
    }.bind(this),
    bit: function(n,i){
      return Math.floor(n * (Math.pow(1 - i,2) * 765)) / (Math.pow(1 - i,2) * 765)
    }.bind(this),
    rnd: function(n,i){
      return Math.max(0,Math.min(1,(n + (-i + (Math.random() * i * 2)))))
    }.bind(this),
    drv: function(n,i){
      return Math.min(1,Math.pow((1 + n),((1 + i))) - 1)
    }.bind(this)
  }
  this.wavetables = {
    sqr: function(n){
      return (n % 2) < 1 ? 0 : 0.99999
    },
    saw: function(n){
      return ((n + 1)  * 0.5) % 1
    },
    tri: function(n){
      return (n % 2) < 1 ? (n % 2) : (2 - (n % 2))
    },
    sin: function(n){
      let tri = (n % 2) < 1 ? (n % 2) : (2 - (n % 2))
      return (1 + Math.sin((1.5 + tri) * Math.PI)) * 0.5
    }
  }
  this.get = function(x,y,z,t){
    let n = 0
    for(let o in this.config.osc){
      let osc = this.config.osc[o]
      if(osc.run && osc.type != "off"){
        /*processing the oscilator*/
        let _n = 0
        switch(osc.typ){
          case "prl":
            _n = (noise.perlin3(
              ((x + (t * (0.4994994994994995 - osc.config.x.off) * 10)) * osc.config.x.frq),
              ((y + (t * (0.4994994994994995 - osc.config.y.off) * 10)) * osc.config.y.frq),
              ((z + (t * (0.4994994994994995 - osc.config.z.off) * 10)) * osc.config.z.frq)
            ) + 1) * 0.5
            break
          case "plx":
            _n = (noise.simplex3(
              ((x + (t * (0.4994994994994995 - osc.config.x.off) * 10)) * osc.config.x.frq),
              ((y + (t * (0.4994994994994995 - osc.config.y.off) * 10)) * osc.config.y.frq),
              ((z + (t * (0.4994994994994995 - osc.config.z.off) * 10)) * osc.config.z.frq)
            ) + 1) * 0.5
            break
          case "osc":
              /*Rotation*/
              let mod = osc.config.z.mod * 3.99
              let angle = y
              if(mod){
                if(mod < 1){
                  mod = mod % 1
                  angle = ((mod * x) + ((1 - mod) * y))
                }
                else if(mod < 2){
                  mod = mod % 1
                  angle = ((mod * -y) + ((1 - mod) * x))
                }
                else if(mod < 3){
                  mod = mod % 1
                  angle = ((mod * -x) + ((1 - mod) * -y))
                }
                else{
                  mod = mod % 1
                  angle = ((mod * y) + ((1 - mod) * -x))
                }
              }
              /*Shape*/
              let v = (angle * osc.config.z.frq + (t * osc.config.z.len * 10) + osc.config.z.off * osc.config.z.frq * 100)
              let center = osc.config.z.cen
              let shape = osc.config.z.shp
              let tri
              if((v % 1) < center){
                tri = (v % 1) * 1 / center
              }
              else{
                tri = 1 - (((v % 1) - center) * (1 / (1 - center)))
              }
              let sin = ((1 + Math.sin((1.5 + tri) * Math.PI)) * 0.5)
              let sqr = tri < center ? 0 : 1
              if(shape <= 0.5){
                _n = tri * ((0.5 - shape) * 2) + sin * (shape * 2)
              }
              else{
                _n = sin * (2 - shape * 2) + sqr * ((shape - 0.5) * 2)
              }
              break
            default:
            if(this.wavetables[osc.typ]){
              /*Rotation*/
              let mod = osc.config.z.mod * 3.99
              let angle = y
              if(mod){
                if(mod < 1){
                  mod = mod % 1
                  angle = ((mod * x) + ((1 - mod) * y))
                }
                else if(mod < 2){
                  mod = mod % 1
                  angle = ((mod * -y) + ((1 - mod) * x))
                }
                else if(mod < 3){
                  mod = mod % 1
                  angle = ((mod * -x) + ((1 - mod) * -y))
                }
                else{
                  mod = mod % 1
                  angle = ((mod * y) + ((1 - mod) * -x))
                }
              }
              /*Shape*/
              let v = (angle * osc.config.z.frq + (t * osc.config.z.len * 20) + osc.config.z.off * osc.config.z.frq * 100)
              _n = this.wavetables[osc.typ](v)
            }
        }
        /*applying all fx in effects chain*/
        for(let f in osc.fx.c){
          let fx = osc.fx.c[f]
          _n = this.fx[fx](_n,osc.fx[fx])
        }
        /*scaling and final amplification*/
        _n = (osc.min + ((osc.max - osc.min) * _n))
        if(_n >= (osc.filter.hpf * (osc.max - osc.min)) + osc.min && _n <= osc.min + (1 - osc.filter.lpf) * (osc.max - osc.min) ){
          // _n *= osc.amp
          switch(osc.mix){
            case "add":
              n += _n
              break
            case "sub":
              n -= _n
              break
            case "mlt":
              n *= _n
              break
            case "div":
              n /= _n
              break
            case "mod":
              let mn = n % _n
              if(mn == 1){
                 mn = n
              }
              else if(mn == 0){
                 mn = n
              }
              n = mn
          }
        }
      }
    }
    /*Sends sum through master effects*/
    for(let f in this.config.fx.c){
      let fx = this.config.fx.c[f]
      n = this.fx[fx](n,this.config.fx[fx])
    }
    /*Different amp behaviors for clipping values*/
    switch(this.config.typ){
      /*Simply clips of the signal*/
      case "clp":
        n = Math.max(0,Math.min(1,n))
        break
      /*Uses mod on the signal, turning a signal of 1.1 to 0.1*/
      case "mod":
        n = n % 1
        break
      /*Dynamically determines maximum amplitude over time and scales all signals accordingly*/
      case "dyn":
        if(n > this.dynamics.d){
          this.dynamics.d = n
        }
        n = n / this.dynamics.d
        if(t != this.dynamics.t){
          this.dynamics.t = t
          this.dynamics.d = 0
        }
        break
    }
    /*Final amplification*/
    n = Math.min(1,n * this.config.amp)
    return n
  }
  this.update = function(callback){
    this.storage.get("config", function(error, data) {
      if(error){
        throw error
      }
      else if(isNotEmptyObject(data)){
        this.config = JSON.parse(data)
        if(!this.initiated){
          this.createRender()
          this.initiated = true
        }
      }
    }.bind(this));
  }
  this.init = function(){
    this.reseed()
    this.ipc.on("requireUpdate", function () {
      this.update()
    }.bind(this));
    this.ipc.on("requireSave", function () {
      this.store()
    }.bind(this));
    this.ipc.on("requireReseed", function () {
      this.reseed()
    }.bind(this));
    this.ipc.on("requirePNG", function () {
      this.export("png")
    }.bind(this));
    this.ipc.on("requireJPG", function () {
      this.export("jpg")
    }.bind(this));
    this.ipc.on("requireWEBMStart", function () {
      this.export("webm",false)
    }.bind(this));
    this.ipc.on("requireWEBMStop", function () {
      this.export("webm",true)
    }.bind(this));
    this.ipc.on("requireGIFStart", function () {
      this.export("gif",false)
    }.bind(this));
    this.ipc.on("requireGIFStop", function () {
      this.export("gif",true)
    }.bind(this));
    this.update()
  }
  this.init()
}
