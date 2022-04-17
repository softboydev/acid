import GIF from '/libs/gif'
import CanvasRecorder from '/libs/CanvasRecorder'
import noise from '/libs/noise'
import isNotEmptyObject from '/libs/isNotEmptyObject'
import ACIDRENDER from 'acidrender'

export function ACID(storage,ipc,canvas,textlayer,env){
  this.env = env
  this.storage = storage
  this.ipc = ipc
  this.config = {}
  this.seed = 0
  this.canvas = canvas
  this.ascii = textlayer
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
    this.wavetables.random
    for(let i = 0; i < 100; i++){
      let r = Math.round(Math.random() * 1000) / 1000
      this.wavetables.random.push(r)
    }
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
    new ACIDRENDER(this.storage,this.ipc,this.canvas,this.ascii,this,this.env)
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
    rotation: [[0,1],[0.011,0.989],[0.022,0.978],[0.033,0.967],[0.044,0.956],[0.056,0.944],[0.067,0.933],[0.078,0.922],[0.089,0.911],[0.1,0.9],[0.111,0.889],[0.122,0.878],[0.133,0.867],[0.144,0.856],[0.156,0.844],[0.167,0.833],[0.178,0.822],[0.189,0.811],[0.2,0.8],[0.211,0.789],[0.222,0.778],[0.233,0.767],[0.244,0.756],[0.256,0.744],[0.267,0.733],[0.278,0.722],[0.289,0.711],[0.3,0.7],[0.311,0.689],[0.322,0.678],[0.333,0.667],[0.344,0.656],[0.356,0.644],[0.367,0.633],[0.378,0.622],[0.389,0.611],[0.4,0.6],[0.411,0.589],[0.422,0.578],[0.433,0.567],[0.444,0.556],[0.456,0.544],[0.467,0.533],[0.478,0.522],[0.489,0.511],[0.5,0.5],[0.511,0.489],[0.522,0.478],[0.533,0.467],[0.544,0.456],[0.556,0.444],[0.567,0.433],[0.578,0.422],[0.589,0.411],[0.6,0.4],[0.611,0.389],[0.622,0.378],[0.633,0.367],[0.644,0.356],[0.656,0.344],[0.667,0.333],[0.678,0.322],[0.689,0.311],[0.7,0.3],[0.711,0.289],[0.722,0.278],[0.733,0.267],[0.744,0.256],[0.756,0.244],[0.767,0.233],[0.778,0.222],[0.789,0.211],[0.8,0.2],[0.811,0.189],[0.822,0.178],[0.833,0.167],[0.844,0.156],[0.856,0.144],[0.867,0.133],[0.878,0.122],[0.889,0.111],[0.9,0.1],[0.911,0.089],[0.922,0.078],[0.933,0.067],[0.944,0.056],[0.956,0.044],[0.967,0.033],[0.978,0.022],[0.989,0.011],[1,0],[0.989,-0.011],[0.978,-0.022],[0.967,-0.033],[0.956,-0.044],[0.944,-0.056],[0.933,-0.067],[0.922,-0.078],[0.911,-0.089],[0.9,-0.1],[0.889,-0.111],[0.878,-0.122],[0.867,-0.133],[0.856,-0.144],[0.844,-0.156],[0.833,-0.167],[0.822,-0.178],[0.811,-0.189],[0.8,-0.2],[0.789,-0.211],[0.778,-0.222],[0.767,-0.233],[0.756,-0.244],[0.744,-0.256],[0.733,-0.267],[0.722,-0.278],[0.711,-0.289],[0.7,-0.3],[0.689,-0.311],[0.678,-0.322],[0.667,-0.333],[0.656,-0.344],[0.644,-0.356],[0.633,-0.367],[0.622,-0.378],[0.611,-0.389],[0.6,-0.4],[0.589,-0.411],[0.578,-0.422],[0.567,-0.433],[0.556,-0.444],[0.544,-0.456],[0.533,-0.467],[0.522,-0.478],[0.511,-0.489],[0.5,-0.5],[0.489,-0.511],[0.478,-0.522],[0.467,-0.533],[0.456,-0.544],[0.444,-0.556],[0.433,-0.567],[0.422,-0.578],[0.411,-0.589],[0.4,-0.6],[0.389,-0.611],[0.378,-0.622],[0.367,-0.633],[0.356,-0.644],[0.344,-0.656],[0.333,-0.667],[0.322,-0.678],[0.311,-0.689],[0.3,-0.7],[0.289,-0.711],[0.278,-0.722],[0.267,-0.733],[0.256,-0.744],[0.244,-0.756],[0.233,-0.767],[0.222,-0.778],[0.211,-0.789],[0.2,-0.8],[0.189,-0.811],[0.178,-0.822],[0.167,-0.833],[0.156,-0.844],[0.144,-0.856],[0.133,-0.867],[0.122,-0.878],[0.111,-0.889],[0.1,-0.9],[0.089,-0.911],[0.078,-0.922],[0.067,-0.933],[0.056,-0.944],[0.044,-0.956],[0.033,-0.967],[0.022,-0.978],[0.011,-0.989],[0,-1],[-0.011,-0.989],[-0.022,-0.978],[-0.033,-0.967],[-0.044,-0.956],[-0.056,-0.944],[-0.067,-0.933],[-0.078,-0.922],[-0.089,-0.911],[-0.1,-0.9],[-0.111,-0.889],[-0.122,-0.878],[-0.133,-0.867],[-0.144,-0.856],[-0.156,-0.844],[-0.167,-0.833],[-0.178,-0.822],[-0.189,-0.811],[-0.2,-0.8],[-0.211,-0.789],[-0.222,-0.778],[-0.233,-0.767],[-0.244,-0.756],[-0.256,-0.744],[-0.267,-0.733],[-0.278,-0.722],[-0.289,-0.711],[-0.3,-0.7],[-0.311,-0.689],[-0.322,-0.678],[-0.333,-0.667],[-0.344,-0.656],[-0.356,-0.644],[-0.367,-0.633],[-0.378,-0.622],[-0.389,-0.611],[-0.4,-0.6],[-0.411,-0.589],[-0.422,-0.578],[-0.433,-0.567],[-0.444,-0.556],[-0.456,-0.544],[-0.467,-0.533],[-0.478,-0.522],[-0.489,-0.511],[-0.5,-0.5],[-0.511,-0.489],[-0.522,-0.478],[-0.533,-0.467],[-0.544,-0.456],[-0.556,-0.444],[-0.567,-0.433],[-0.578,-0.422],[-0.589,-0.411],[-0.6,-0.4],[-0.611,-0.389],[-0.622,-0.378],[-0.633,-0.367],[-0.644,-0.356],[-0.656,-0.344],[-0.667,-0.333],[-0.678,-0.322],[-0.689,-0.311],[-0.7,-0.3],[-0.711,-0.289],[-0.722,-0.278],[-0.733,-0.267],[-0.744,-0.256],[-0.756,-0.244],[-0.767,-0.233],[-0.778,-0.222],[-0.789,-0.211],[-0.8,-0.2],[-0.811,-0.189],[-0.822,-0.178],[-0.833,-0.167],[-0.844,-0.156],[-0.856,-0.144],[-0.867,-0.133],[-0.878,-0.122],[-0.889,-0.111],[-0.9,-0.1],[-0.911,-0.089],[-0.922,-0.078],[-0.933,-0.067],[-0.944,-0.056],[-0.956,-0.044],[-0.967,-0.033],[-0.978,-0.022],[-0.989,-0.011],[-1,0],[-0.989,0.011],[-0.978,0.022],[-0.967,0.033],[-0.956,0.044],[-0.944,0.056],[-0.933,0.067],[-0.922,0.078],[-0.911,0.089],[-0.9,0.1],[-0.889,0.111],[-0.878,0.122],[-0.867,0.133],[-0.856,0.144],[-0.844,0.156],[-0.833,0.167],[-0.822,0.178],[-0.811,0.189],[-0.8,0.2],[-0.789,0.211],[-0.778,0.222],[-0.767,0.233],[-0.756,0.244],[-0.744,0.256],[-0.733,0.267],[-0.722,0.278],[-0.711,0.289],[-0.7,0.3],[-0.689,0.311],[-0.678,0.322],[-0.667,0.333],[-0.656,0.344],[-0.644,0.356],[-0.633,0.367],[-0.622,0.378],[-0.611,0.389],[-0.6,0.4],[-0.589,0.411],[-0.578,0.422],[-0.567,0.433],[-0.556,0.444],[-0.544,0.456],[-0.533,0.467],[-0.522,0.478],[-0.511,0.489],[-0.5,0.5],[-0.489,0.511],[-0.478,0.522],[-0.467,0.533],[-0.456,0.544],[-0.444,0.556],[-0.433,0.567],[-0.422,0.578],[-0.411,0.589],[-0.4,0.6],[-0.389,0.611],[-0.378,0.622],[-0.367,0.633],[-0.356,0.644],[-0.344,0.656],[-0.333,0.667],[-0.322,0.678],[-0.311,0.689],[-0.3,0.7],[-0.289,0.711],[-0.278,0.722],[-0.267,0.733],[-0.256,0.744],[-0.244,0.756],[-0.233,0.767],[-0.222,0.778],[-0.211,0.789],[-0.2,0.8],[-0.189,0.811],[-0.178,0.822],[-0.167,0.833],[-0.156,0.844],[-0.144,0.856],[-0.133,0.867],[-0.122,0.878],[-0.111,0.889],[-0.1,0.9],[-0.089,0.911],[-0.078,0.922],[-0.067,0.933],[-0.056,0.944],[-0.044,0.956],[-0.033,0.967],[-0.022,0.978],[0,1]],
    random: [0.834,0.924,0.075,0.335,0.517,0.13,0.101,0.646,0.389,0.947,0.385,0.353,0.512,0.494,0.946,0.999,0.621,0.341,0.049,0.05,0.279,0.315,0.465,0.405,0.019,0.669,0.545,0.752,0.793,0.23,0.814,0.348,0.979,0.277,0.404,0.215,0.073,0.065,0.026,0.039,0.579,0.382,0.864,0.92,0.139,0.712,0.506,0.29,0.805,0.4,0.775,0.901,0.563,0.764,0.813,0.558,0.744,0.871,0.225,0.273,0.988,0.357,0.141,0.145,0.008,0.271,0.137,0.325,0.342,0.847,0.455,0.837,0.247,0.565,0.461,0.034,0.54,0.161,0.341,0.156,0.565,0.004,0.286,0.105,0.418,0.713,0.615,0.229,0.143,0.205,0.64,0.948,0.292,0.433,0.047,0.062,0.704,0.342,0.147,0.935],
  }
  this.get = function(x,y,z,t){
    let n = [0,0,0,0]
    let _n = 0
    var i = 0
    while(i < 5){
      let osc = this.config.osc[i]
      if(osc.run && osc.type != "off"){
        /*processing the oscilator*/
        switch(osc.typ){
          case "org":
            _n = (noise.simplex3(
              ((x + (t * (0.4994994994994995 - osc.config.x.off) * 1000)) * osc.config.x.frq * 0.1),
              ((y + (t * (0.4994994994994995 - osc.config.y.off) * 1000)) * osc.config.y.frq * 0.1),
              ((z + (t * (0.4994994994994995 - osc.config.z.off) * 100)) * osc.config.z.frq * 0.01)
            ) + 1) * 0.5
            let r = _n * (1 - osc.config.z.shp) + (_n + this.wavetables.random[Math.round(_n * osc.config.z.cen * 99)]) * osc.config.z.shp
            _n = r < 0 ? 0 : r > 1 ? 1 : r
            break
          case "prl":
            _n = (noise.perlin3(
              ((x + (t * (0.4994994994994995 - osc.config.x.off) * 1000)) * osc.config.x.frq * 0.05),
              ((y + (t * (0.4994994994994995 - osc.config.y.off) * 1000)) * osc.config.y.frq * 0.05),
              ((z + (t * (0.4994994994994995 - osc.config.z.off) * 100)) * osc.config.z.frq * 0.01)
            ) + 1) * 0.5
            break
          case "plx":
            _n = (noise.simplex3(
              ((x + (t * (0.4994994994994995 - osc.config.x.off) * 1000)) * osc.config.x.frq * 0.05),
              ((y + (t * (0.4994994994994995 - osc.config.y.off) * 1000)) * osc.config.y.frq * 0.05),
              ((z + (t * (0.4994994994994995 - osc.config.z.off) * 100)) * osc.config.z.frq * 0.01)
            ) + 1) * 0.5
            break
            default:
              let v = (
                (
                  this.wavetables.rotation[Math.round((1 - osc.config.z.mod) * 359)][0] * x +
                  this.wavetables.rotation[Math.round((1 - osc.config.z.mod) * 359)][1] * y
                ) *
                osc.config.z.frq * 0.1 +
                (
                  t * osc.config.z.len * 1
                ) +
                osc.config.z.off
              ) % 1
              switch(osc.typ){
                case "saw":
                  _n = v
                  break
                case "rmp":
                  _n = 1 - v
                  break
                case "sqr":
                  _n = v < 0.5 ? 1 : 0
                  break
                case "pwm":
                  _n = v < osc.config.z.cen ? 1 : 0
                  break
                case "tri":
                  _n = v < 0.5 ? v * 2 : 1 - ((v - 0.5) * 2)
                  break
                case "sin":
                  let tri = v < 0.5 ? v * 2 : 1 - ((v - 0.5) * 2)
                  _n = (1 + Math.sin((1.5 + tri) * Math.PI)) * 0.5
                  break
                case "osc":
                    /*Shape*/
                    let center = osc.config.z.cen
                    let shape = osc.config.z.shp
                    let t
                    if((v % 1) < center){
                      t = (v % 1) * 1 / center
                    }
                    else{
                      t = 1 - (((v % 1) - center) * (1 / (1 - center)))
                    }
                    let sin = ((1 + Math.sin((1.5 + t) * Math.PI)) * 0.5)
                    let sqr = t < center ? 0 : 1
                    if(shape <= 0.5){
                      _n = t * ((0.5 - shape) * 2) + sin * (shape * 2)
                    }
                    else{
                      _n = sin * (2 - shape * 2) + sqr * ((shape - 0.5) * 2)
                    }
                    break
              }
        }
        /*applying all fx in effects chain*/
        if(this.config.render.optimization.effects == "on"){
          var f = 0
          while(f < osc.fx.c.length){
            let fx = osc.fx.c[f]
            _n = this.fx[fx](_n,osc.fx[fx])
            f++
          }
        }

        /*scaling and final amplification*/
        _n = (osc.min + ((osc.max - osc.min) * _n))
        if(_n >= (osc.filter.hpf * (osc.max - osc.min)) + osc.min && _n <= osc.min + (1 - osc.filter.lpf) * (osc.max - osc.min) ){
          // _n *= osc.amp
          switch(osc.mix){
            case "add":
              n[0] += _n * osc.channels.r
              n[1] += _n * osc.channels.g
              n[2] += _n * osc.channels.b
              n[3] += _n * osc.channels.a
              break
            case "sub":
              n[0] -= _n * osc.channels.r
              n[1] -= _n * osc.channels.g
              n[2] -= _n * osc.channels.b
              n[3] -= _n * osc.channels.a
              break
            case "mlt":
              n[0] *= _n * osc.channels.r
              n[1] *= _n * osc.channels.g
              n[2] *= _n * osc.channels.b
              n[3] *= _n * osc.channels.a
              break
            case "div":
              n[0] /= _n * osc.channels.r
              n[1] /= _n * osc.channels.g
              n[2] /= _n * osc.channels.b
              n[3] /= _n * osc.channels.a
              break
          }
        }
      }
      i++
    }
    /*Different amp behaviors for clipping values*/
    switch(this.config.typ){
      /*Simply clips of the signal*/
      case "clp":
        n[0] = Math.max(0,Math.min(1,n[0]))
        n[1] = Math.max(0,Math.min(1,n[1]))
        n[2] = Math.max(0,Math.min(1,n[2]))
        n[3] = Math.max(0,Math.min(1,n[3]))
        break
      /*Uses mod on the signal, turning a signal of 1.1 to 0.1*/
      case "mod":
        n[0] = n[0] > 1 ? n[0] % 1 : n[0]
        n[1] = n[1] > 1 ? n[1] % 1 : n[1]
        n[2] = n[2] > 1 ? n[2] % 1 : n[2]
        n[3] = n[3] > 1 ? n[3] % 1 : n[3]
        break
      /*Dynamically determines maximum amplitude over time and scales all signals accordingly*/
      case "dyn":
        if(n[0] > this.dynamics.d){
          this.dynamics.d = n[0]
        }
        if(n[1] > this.dynamics.d){
          this.dynamics.d = n[1]
        }
        if(n[2] > this.dynamics.d){
          this.dynamics.d = n[2]
        }
        if(n[3] > this.dynamics.d){
          this.dynamics.d = n[3]
        }
        n[0] = n[0] / this.dynamics.d
        n[1] = n[1] / this.dynamics.d
        n[2] = n[2] / this.dynamics.d
        n[3] = n[3] / this.dynamics.d
        if(t != this.dynamics.t){
          this.dynamics.t = t
          this.dynamics.d = 0
        }
        break
    }
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
    this.ipc.on("requireReseed", function () {
      this.reseed()
    }.bind(this));
    if(env == "main"){
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
      this.ipc.on("requireSave", function () {
        this.store()
      }.bind(this));
    }
    this.update()
  }
  this.init()
}
