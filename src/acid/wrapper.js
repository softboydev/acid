import GIF from '/libs/gif'
import CanvasRecorder from '/libs/CanvasRecorder'
import isNotEmptyObject from '/libs/isNotEmptyObject'
import {AcidRender} from './render'
import {Acid} from './acid'


/* Wrapper that runs the IP communictaion, storage and exporting and brings render and generator along*/
export function AcidWrapper(storage,ipc,canvas,textlayer,env){
  this.storage = storage //reference to json storage
  this.ipc = ipc //reference to ipc object
  this.config = {}
  this.seed = 0 //randomseed used for this wrapper
  this.canvas = canvas //reference to monitoring canvas used in this wrapper
  this.wasinit = false
  // this.exporting = false
  // this.canvasCapturerer = {
  //   requestGifFrame: function(delay){
  //     if(this.canvasCapturerer.addFrames){
  //       this.canvasCapturerer.gif.addFrame(this.canvas, {delay: delay});
  //     }
  //   }.bind(this)
  // }
  // this.export = function(fileType,capture){
  //   if(capture){
  //     switch(fileType){
  //       case "webm":
  //         if(this.canvasCapturerer.recorder){
  //           this.canvasCapturerer.recorder.stop()
  //           this.toggleRecorderUI(false)
  //           this.toggleExporterUI(true)
  //           this.canvasCapturerer.recorder.save(this.getExportFilename("webm"))
  //           this.toggleExporterUI(false)
  //           this.save()
  //           this.canvasCapturerer.recorder = false
  //           this.exporting = false
  //         }
  //         break
  //       case "gif":
  //         this.canvasCapturerer.addFrames = false
  //         this.toggleRecorderUI(false)
  //         this.toggleExporterUI(true)
  //         this.canvasCapturerer.gif.on('finished', function(blob) {
  //           this.download(blob,this.getExportFilename("gif"),true)
  //           this.canvasCapturerer.gif = false
  //           this.toggleExporterUI(false)
  //         }.bind(this));
  //         this.canvasCapturerer.gif.render();
  //
  //         break;
  //     }
  //   }
  //   else if(!this.exporting){
  //     this.exporting = true
  //     switch(fileType){
  //       case "jpg":
  //         this.canvas.toBlob(function(blob) {
  //           this.download(blob,this.getExportFilename("jpg"),true)
  //         }.bind(this),'image/jpeg', 0.95)
  //         break
  //       case "png":
  //         this.canvas.toBlob(function(blob) {
  //           this.download(blob,this.getExportFilename("png"),true)
  //         }.bind(this),'image/png')
  //         break
  //       case "webm":
  //         this.toggleRecorderUI(true)
  //         this.canvasCapturerer.recorder = new CanvasRecorder(this.canvas)
  //         this.canvasCapturerer.recorder.start()
  //         break
  //       case "gif":
  //         this.toggleRecorderUI(true)
  //         this.canvasCapturerer.gif = new GIF({
  //           workers: 2,
  //           quality: 10,
  //           workerScript: "./js/gif.worker.js"
  //         });
  //         this.canvasCapturerer.addFrames = true
  //         break
  //
  //     }
  //   }
  // }
  // this.getExportFilename = function(type){
  //   return "acid." + type;
  // }
  // this.download = function(blob,name,isexport){
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.style.display = 'none';
  //   a.href = url;
  //   a.download = name;
  //   document.body.appendChild(a);
  //   a.click();
  //   if(isexport){
  //     this.exporting = false
  //     this.save()
  //   }
  //   setTimeout(() => {
  //       document.body.removeChild(a);
  //       window.URL.revokeObjectURL(url);
  //   }, 100);
  // }
  // this.store = function(){
  //   let blob = new Blob([JSON.stringify(this.config)], {type: 'text/plain'});
  //   this.download(blob,"config.txt",false)
  // }
  this.save = function(){ //stores the config to storage and request an update over ipc afterwards
    this.storage.set("config", JSON.stringify(this.config), function(error) {
      if (error){
        throw error
      }
      else{
        this.ipc.send("requestUpdate","");
      }
    }.bind(this));
  }

  this.reseed = function(){
    this.seed = Math.random() * 1000 //sets random seed
    this.acid.reseed(this.seed) //passes the seed onto acid

  }
  this.update = function(callback){ //called when the wrapper need to be updated
    this.storage.get("config", function(error, data) {
      if(error){
        throw error
      }
      else if(isNotEmptyObject(data)){
        this.config = JSON.parse(data)
        if(!this.wasinit){
          this.createRender()
          this.wasinit = true
        }
      }
    }.bind(this));
  }
  this.newRender = function(){
    return new AcidRender(this.storage,this.ipc,this.canvas)
  }
  this.newAcid = function(){
    return new Acid(this.storage,this.ipc,this.canvas)
  }
  this.init = function(){
    this.reseed()
    this.acid = this.newAcid()
    this.render = this.newRender()
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
    }
    this.update()
  }
  this.init()
}
