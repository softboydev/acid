function ACIDRENDER(storage,ipc,canvas,mothership){
  this.storage = storage
  this.ipc = ipc
  this.canvas = canvas
  this.context = this.canvas.getContext("2d")
  this.mothership = mothership
  this.config = {}
  this.storage = storage
  this.count = 1000
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
  this.engines = {
    s2d: function(get,ctx,config,dimensions,t){
      let background = config.clrs[0] || "#000000"
      ctx.fillStyle = background
      ctx.fillRect(0,0,dimensions.width,dimensions.height)
      let d = (dimensions.width + dimensions.height) * 0.5
      let w = 1 + (config.resolution * 24) + (config.x * d)
      let h = 1 + (config.resolution * 24) + (config.y * d)
      for(let y = 0; y < dimensions.height / h; y++){
        for(let x = 0; x < dimensions.width / w; x++){
          let c = get(x,y,0,t)
          let _x = x * w
          let _y = y * h
          let color = "#ffffff"
          if(!config.hsl){
            color = "hsl(" + ((1 - c) * 240) + ", 100%, 50%)";
          }
          else{
            if(config.mod == "hsl"){
              let rgb = hexToRgb(config.prm)
              let h =  ((1 - c) * rgb.r / 256) * 360 * config.clr
              let s = ((1 - c) * rgb.g / 256) * 100 * config.clr
              let l = ((1 - c) * rgb.b / 256) * 100 * config.clr
              color = "hsl(" + h + ", " + s + "%, " + l + "%)";
            }
            else if(config.mod == "grd" && config.clr != 0){
              color = mix(config.bck.substring(1),config.prm.substring(1), (1 - c * config.clr) * 100)
            }
            else if(config.mod == "ndx" && config.clr != 0 && config.clrs.length > 1){
              color = config.clrs[Math.floor((c * config.clr) * config.clrs.length)]
            }
            else if(config.mod == "rgb"){
              let rgb = hexToRgb(config.prm)
              let r = rgb.r / 255 * (c * 255) * config.clr
              let g = rgb.g / 255 * ((c * 255 * 255) % 255) * config.clr
              let b = rgb.b / 255 * ((c * 255 * 255 * 255) % 255) * config.clr
              color = "rgb(" +  r + "," + g + "," + b + ")"
            }
          }
          ctx.fillStyle = color
          ctx.fillRect(_x,_y,w,h)
        }
      }
    },
    c2d: function(get,ctx,config,dimensions,t){
      let background = config.bck || "#000000"
      ctx.fillStyle = background
      ctx.fillRect(0,0,dimensions.width,dimensions.height)
      let d = (dimensions.width + dimensions.height) * 0.5
      let w = 1 + (config.resolution * 24) + (config.x * d)
      let h = 1 + (config.resolution * 24) + (config.y * d)
      for(let y = 0; y < dimensions.height / h; y++){
        for(let x = 0; x < dimensions.width / w; x++){
          let c = get(x,y,0,t)
          let pt = Math.min(((config.pad.n + (0.5 * (1 - c) * config.pad.dn)) * w * 0.5), w * 0.5)
          let pr = Math.min(((config.pad.e + (0.5 * (1 - c) * config.pad.de)) * h * 0.5), h * 0.5)
          let pb = Math.min(((config.pad.s + (0.5 * (1 - c) * config.pad.ds)) * h * 0.5), h * 0.5)
          let pl = Math.min(((config.pad.w + (0.5 * (1 - c) * config.pad.dw)) * h * 0.5), h * 0.5)
          let bx = x * w
          let by = y * h
          let _x = x * w + pl
          let _y = y * h + pt
          let cx = x * w + 0.5 * w
          let cy = y * h + 0.5 * h
          let dx = w - pl - pr
          let dy = h - pt - pb
          let rtl = Math.min(dx,dy) * (config.rad.tl * 0.5 - c * 0.5 * config.rad.dtl)
          let rtr = Math.min(dx,dy) * (config.rad.tr * 0.5 - c * 0.5 * config.rad.dtr)
          let rbr = Math.min(dx,dy) * (config.rad.br * 0.5 - c * 0.5 * config.rad.dbr)
          let rbl = Math.min(dx,dy) * (config.rad.bl * 0.5 - c * 0.5 * config.rad.dbl)
          let rotation = (config.r + (c * config.rot)) * 2 * Math.PI
          let color = "#ffffff"
          let secColor = "#000000"
          /*Primary Color*/
          if(!config.hsl){
            color = "hsl(" + ((1 - c) * 240) + ", 100%, 50%)";
          }
          else{
            if(config.mod == "hsl"){
              let rgb = hexToRgb(config.prm)
              let h =  ((1 - c) * rgb.r / 256) * 360 * config.clr
              let s = ((1 - c) * rgb.g / 256) * 100 * config.clr
              let l = ((1 - c) * rgb.b / 256) * 100 * config.clr
              color = "hsl(" + h + ", " + s + "%, " + l + "%)";
            }
            else if(config.mod == "grd" && config.clr != 0){
              color = mix(config.bck.substring(1),config.prm.substring(1), (1 - c * config.clr) * 100)
            }
            else if(config.mod == "ndx" && config.clr != 0 && config.clrs.length > 1){
              color = config.clrs[Math.floor((c * config.clr) * config.clrs.length)]
            }
            else if(config.mod == "rgb"){
              let rgb = hexToRgb(config.prm)
              let r = rgb.r / 255 * (c * 255) * config.clr
              let g = rgb.g / 255 * ((c * 255 * 255) % 255) * config.clr
              let b = rgb.b / 255 * ((c * 255 * 255 * 255) % 255) * config.clr
              color = "rgb(" +  r + "," + g + "," + b + ")"
            }
          }
          /*Secodary Color*/
          if(!config.hsl){
            secColor = "hsl(" + ((1 - c) * 240) + ", 100%, 50%)";
          }
          else{
            if(config.sec.mod == "hsl"){
              let rgb = hexToRgb(config.sec.prm)
              let h =  ((1 - c * config.sec.clr) * rgb.r / 256) * 360
              let s = ((1 - c * config.sec.clr) * rgb.g / 256) * 100
              let l = ((1 - c * config.sec.clr) * rgb.b / 256) * 100
              secColor = "hsl(" + h + ", " + s + "%, " + l + "%)";
            }
            else if(config.sec.mod == "grd" && config.sec.clr != 0){
              secColor = mix(config.sec.bck.substring(1),config.sec.prm.substring(1), (1 - c * config.sec.clr) * 100)
            }
            else if(config.sec.mod == "ndx" && config.sec.clr != 0 && config.sec.clrs.length > 1){
              secColor = config.sec.clrs[Math.floor((c * config.sec.clr) * config.sec.clrs.length)]
            }
            else if(config.sec.mod == "rgb"){
              let rgb = hexToRgb(config.sec.prm)
              let r = rgb.r / 255 * (config.sec.clr * c * 255)
              let g = rgb.g / 255 * ((config.sec.clr * c * 255 * 255) % 255)
              let b = rgb.b / 255 * ((config.sec.clr * c * 255 * 255 * 255) % 255)
              secColor = "rgb(" +  r + "," + g + "," + b + ")"
            }
          }
          ctx.fillStyle = secColor
          ctx.fillRect(bx,by,w,h)
          ctx.fillStyle = color
          ctx.translate(cx, cy);
          ctx.rotate(rotation);
          ctx.translate(-cx, -cy);
          ctx.beginPath();
          ctx.moveTo(_x + rtl, _y);
          ctx.lineTo(_x + dx - rtr, _y);
          ctx.quadraticCurveTo(_x + dx, _y, _x + dx, _y + rtr);
          ctx.lineTo(_x + dx, _y + dy - rbr);
          ctx.quadraticCurveTo(_x + dx, _y + dy, _x + dx - rbr, _y + dy);
          ctx.lineTo(_x + rbl, _y + dy);
          ctx.quadraticCurveTo(_x, _y + dy, _x, _y + dy - rbl);
          ctx.lineTo(_x, _y + rtl);
          ctx.quadraticCurveTo(_x, _y, _x + rtl, _y);
          ctx.closePath();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fill()
        }
      }
    }
  }
  this.canvas = canvas
  this.context = this.canvas.getContext("2d")
  this.resize = function(){
    this.dimensions.width = window.innerWidth
    this.dimensions.height = window.innerHeight
    this.canvas.width = this.dimensions.width
    this.canvas.height = this.dimensions.height
  }
  this.render = function(){
    if(this.engines[this.config.render.eng]){
      let get = this.mothership.get.bind(this.mothership)
      this.engines[this.config.render.eng](get,this.context,this.config.render,this.dimensions,this.count)
    }
    if(this.running){
      this.upCount()
      this.mothership.canvasCapturerer.requestGifFrame(60000 / (this.config.settings.framerate * 60))
    }
    if(!this.stopped){
      setTimeout(function () {
          requestAnimationFrame(function(){
            this.render()
          }.bind(this))
      }.bind(this), 60000 / (this.config.settings.framerate * 60));
    }
  }
  this.init = function(){
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
    this.ipc.on("requireFramejump", function () {
      this.jump(1)
    }.bind(this));
    window.addEventListener("resize",function(){
      this.resize()
    }.bind(this))
    this.resize()
    this.update()
  }
  this.init()
}
