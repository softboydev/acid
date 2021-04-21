function ACIDGUI(storage,ipc){
  this.ipc = ipc
  this.config = {}
  this.storage = storage
  this.initiated
  this.gui = null
  this.guiPosition = {
    x: 0,
    y: 0
  }
  this.tooltips = {
    optimize: "<b>Optimization</b><br><p>Disable certain features when you dont use them. This can improve performance.</p>",
    optimizefx: "<b>Toggle Effects</b><br><p>Will toggle the usage of effects.",
    optimizesubpixels: "<b>Toggle Subpixels</b><br><p>Will toggle the rendering of subpixels. This can also be an artistic decision.</p>",
    optimizefeedback: "<b>Toggle Feedback</b><br><p>Will toggle the virtual feedback engine.",
    optimizecolors: "<b>Toggle Colormodes</b><br><p>Will toggle the availabilty of color modes.</p>",
    analfps: "<b>FPS</b><br><p>Will display the true FPS</p>",
    analwidth: "<b>Width</b><br><p>The current width of the main window</p>",
    analheight: "<b>Height</b><br><p>The current height of the main window</p>",
    settings: "<b>Settings</b><br><p>General settings regarding the renderengine and the user interface.</p>",
    defaultcolor: "<b>Default Color</b><br><p>Sets the default color, when adding new colors in indexed color mode.</p>",
    defaulteffect: "<b>Default Effect</b><br><p>Sets the default effect, when adding new effects to an effects chain.</p>",
    settingsimage: "<b>General Render Settings</b><br><p>General settings regarding the renderengine.</p>",
    framerate: "<b>Framerate</b><br><p>Sets the framerate of the renderengine between 1 and 30 frames per second. High values may slow down or crash the software.</p>",
    resolution: "<b>Resolution</b><br><p>Sets the resolution for the renderengine in an undocked render window.</p>",
    preview: "<b>Preview Settings</b><br><p>Settings for the renderengine in the main window.</p>",
    previewframerate: "<b>Preview Framerate</b><br><p>Framerate in the main window.</p>",
    previewresolution: "<b>Preview Resolution</b><br><p>Resolution in the main window.</p>",
    settingsgui: "<b>General GUI Settings</b><br><p>General settings regarding the graphic user interface.</p>",
    zoom: "<b>GUI Zoom</b><br><p>Changes the scale of the graphic user interface.</p>",
    transparency: "<b>GUI transparency</b><br><p>Changes the transparency of the graphic user interface.</p>",
    tooltips: "<b>toggle GUI tooltips</b><br><p>Toggles the display of tooltips (this is a tooltip).</p>",
    labels: "<b>toggle GUI labels</b><br><p>Toggles the display of numbered labels next to sliders.</p>",
    buttons: "<b>toggle GUI buttons</b><br><p>Toggles the display of buttons next to sliders, that minimize, center, maximize or randomize the sliders value.</p>",
    image: "<b>Image</b><br><p>General settings regarding the whole render process.</p>",
    engine: "<b>Render engine</b><br><p>Selects one of the available render engines. Render engines offer different parameters to influence the generated visuals.</p>",
    colormode: "<b>Colormode</b><br><p>Selects one of the available coloring modes. The color mode determines, which color space is used by the render engine. Click on I/O to toggle a fixed HSL color mode.</p>",
    primarycolor: "<b>Primary Color</b><br><p>Sets a primary color for color modes that require one.</p>",
    backgroundcolor: "<b>Background Color</b><br><p>Sets a background color for color modes that require one.</p>",
    secondarycolor: "<b>Secondary Color</b><br><p>General Settings for a secondary or background color.</p>",
    renderscale: "<b>Resolution</b><br><p>Determines the resolution on both axis for the render engine.</p>",
    resolutionx: "<b>Horizontal Resolution</b><br><p>Determines the horitontal resolution for the render engine.</p>",
    resolutiony: "<b>Vertical Resolution</b><br><p>Determines the vertical resolution for the render engine.</p>",
    rotation: "<b>Rotation</b><br><p>Determines the rotation for the cells in the render engine. The cells size is determined by the resolution settings.</p>",
    modify: "<b>Modify</b><br><p>Settings in this section determine, how much influence ACID can have over specific parameters.</p>",
    modcolor: "<b>Color Modifier</b><br><p>Determines how much ACID can influence the color of the render engine.</p>",
    modseccolor: "<b>Secondary Color Modifier</b><br><p>Determines how much ACID can influence the secondary or background color of the render engine.</p>",
    padding: "<b>Padding</b><br><p>Settings in this section determine how much space is between the edge of a cell and its inner content.</p>",
    modpadding: "<b>Padding Modifier</b><br><p>Determines how much ACID can influence the padding of a cell on a specific edge.</p>",
    paddingn: "<b>Padding Top</b><br><p>Sets the space between the top edge and the content of a cell.</p>",
    paddinge: "<b>Padding Right</b><br><p>Sets the space between the right edge and the content of a cell.</p>",
    paddings: "<b>Padding Bottom</b><br><p>Sets the space between the bottom edge and the content of a cell.</p>",
    paddingw: "<b>Padding Left</b><br><p>Sets the space between the left edge and the content of a cell.</p>",
    radius: "<b>Corner Radius</b><br><p>Settings in this section determine how much the corners of a cell are rounded off.</p>",
    modradius: "<b>Corner Radius Modifier</b><br><p>Determines how much ACID can influence the radius of a cell on specific corner.</p>",
    radiustl: "<b>Corner Radius Top Left</b><br><p>Determines the corner radius for the top left corner.</p>",
    radiustr: "<b>Corner Radius Top Right</b><br><p>Determines the corner radius for the top right corner.</p>",
    radiusbr: "<b>Corner Radius Bottom Right</b><br><p>Determines the corner radius for the bottm right corner.</p>",
    radiusbl: "<b>Corner Radius Bottom Left</b><br><p>Determines the corner radius for the bottom left corner.</p>",
    bus: "<b>Bus</b><br><p>Settings in this section have influence on the master bus, that sums all the oscilator layers.</p>",
    amp: "<b>Amplification</b><br><p>Determines the master amplification of the sum.</p>",
    drive: "<b>Overdrive</b><br><p>Changes, how the amplifier handles to high values.</p>",
    blackandwhite: "<b>Black and White</b><br><p>Fades between color and black and white version of the render</p>",
    burn: "<b>Burn</b><br><p>Can be used to brighten the image by lightening the subpixel colors. Only used when subpixels are enabled.</p>",
    channelmin:"<b>Channel Minimum</b><br><p>Will set the minimum values for all 3 color channels.</p>",
    channelmod:"<b>Channel Modulation</b><br><p>Will set the maximum amount of modulation for all 3 color channels.</p>",
    channelamp:"<b>Channel Amplitude</b><br><p>Will set the maximum values for all 3 color channels. Click on a channel to disable it.</p>",
    feedback:"<b>Feedback</b><br><p>Settings for the virtual feedback engine. Only used when feedback is enabled.</p>",
    fbint:"<b>Feedback Intensity</b><br><p>Set the intensity for the feedback. The higher the intensity the longer time periods are between each feedback step.</p>",
    fbquant:"<b>Feedback Quantization</b><br><p>Set the quantization for the feedback. This will lead to the image getting more and more visible borders or edges.</p>",
    fbcenter:"<b>Feedback Center</b><br><p>Set the relative center for the feedback tunnel.</p>",
    fbmix:"<b>Feedback Mix</b><br><p>Blends between feedback on the horizontal and vertical axis.</p>",
    fbbend:"<b>Feedback Bend</b><br><p>Sets how much the feedback may influence itself thus appearing more and more bend.</p>",
    fbskew:"<b>Feedback Skew</b><br><p>Blends between vertical and horizontal bending.</p>",
    fbsqr:"<b>Feedback Square</b><br><p>Blends between a linear, trianglish looking and a stepped, squarish, tv-ish looking version of the feedback.</p>",
    fbdrk:"<b>Feedback Darken</b><br><p>Set how much darker the images get when they approach the feedback center.</p>",
    fx: "<b>Effects</b><br><p>Settings in this section set the parameters for the different available effect units.</p>",
    fxbit: "<b>Bitcrusher</b><br><p>Reduces the total amount of different values.</p>",
    fxcmp: "<b>Compressor</b><br><p>Amplifies low values more then higher ones.</p>",
    fxexp: "<b>Expander</b><br><p>Works in reverse to the compressor. Reduces low values more then higher ones.</p>",
    fxrnd: "<b>Randomizer</b><br><p>Randomizes all values.</p>",
    fxdrv: "<b>Drive</b><br><p>Amplifies all values equally, can be used as a preamp or overdrive.</p>",
    oscilator: "<b>Oscilator</b><br><p>is either an algorithm or a cyclic function. Both produce a single value between 0 and 1 from 3 positive values. Click on I/O to disable or reenable an oscilator.</p>",
    ostyp: "<b>Oscilator Type</b><br><p>Determines the type of an oscilator.</p>",
    osmix: "<b>Oscilator Mix</b><br><p>Determines how an oscilator is mixed with other oscilators.</p>",
    osmin: "<b>Oscilator Minimum</b><br><p>Determines the minimum amplitude of an oscilator.</p>",
    osmax: "<b>Oscilator Maximum</b><br><p>Determines the maximum amplitude of an oscilator.</p>",
    oslpf: "<b>Oscilator Low Pass Filter</b><br><p>Cuts away values above a treshold. The filter works relative to the mimimum and maximum.</p>",
    oshpf: "<b>Oscilator High Pass Filter</b><br><p>Cuts away values below a treshold. The filter works relative to the minimum and maximum.</p>",
    oscen: "<b>Oscilation Center</b><br><p>Determines the relative center of an oscilators shape. Could be used to create saws and ramps from a triangle shape or to modulate the pulse width of a square shape.</p>",
    osshp: "<b>Oscilation Shape</b><br><p>Determines the shape of an oscilator on a range between pure triangle over pure sine to pure square.</p>",
    osmod: "<b>Oscilator Rotation</b><br><p>Determines the angle of the oscilator on a 2D plane.</p>",
    osfrq: "<b>Oscilator Frequency</b><br><p>Determines the frequency of an oscilator. For a cyclic type this is the length of a single cycle. For algorithms this is similar to a resolution, grain, zoom or density.</p>",
    osspd: "<b>Oscilator Speed</b><br><p>Determines how fast the oscilator moves through the 2D plane in the direction set by rotation. At a speed of 0 the oscilator will not move and may be used as a filter.</p>",
    osoff: "<b>Oscilator Offset</b><br>Offsets the oscilator by up to whole cycle. Mostly useful for moving a fixed oscilator to a certain position.<p>",
    osx: "<b>Oscilator X</b><br><p>Settings for the second dimension of algorithms.</p>",
    osy: "<b>Oscilator Y</b><br><p>Settings for the third dimensions of algorithms.</p>",
    channel: "<b>Oscilator Channels</b><br><p>Sends to the 3 different color channels</p>",
    colorlist: "<b>Color List</b><br><p>An extendable list of colors. Click on --- to empty the list, click on + to add a new entry, click on an entry to change it.</p>",
    fxlist: "<b>Effect Chain</b><br><p>An extendable chain of effects. Effects are passed through from left to right. The settings of an effect are determined by the corresponding settings in an fx section. Click on --- to empty the list, click on + to add a new entry, click on an entry to change it.</p>"
  }
  this.tooltipContainer = document.getElementById("tooltip")
  this.handleTooltip = function(tip,x,y){
    if(tip && this.tooltips[tip] && this.config.settings.tips == "on"){
      this.tooltipContainer.innerHTML = this.tooltips[tip]
      this.tooltipContainer.style.left = x + "px"
      this.tooltipContainer.style.top = y + "px"
      document.body.classList.add("tooltip-is-active")
    }
    else{
      document.body.classList.remove("tooltip-is-active")
    }
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
  this.update = function(){
    this.storage.get("config", function(error, data) {
      if(error){
        throw error
      }
      else if(isNotEmptyObject(data)){
        this.config = JSON.parse(data)
        if(!this.initiated){
          this.initGUI()
          this.initiated = true
        }
        this.updateGUI()
      }
    }.bind(this));
  }
  this.toggle = function(){
    document.body.classList.toggle("ui-active")
  }
  this.hide = function(){
    document.body.classList.remove("ui-active")
  }
  this.show = function(){
    document.body.classList.add("ui-active")
  }
  this.updateGUI = function(){
    this.gui.style.fontSize = (6 + this.config.settings.zoom * 24) + "px"
    this.gui.style.background = "rgba(16,16,16," + (1 - this.config.settings.transparency) +")"
    eachRecursive.apply(this, [this.config,""])
    function eachRecursive(obj,s)
    {
        for (var k in obj)
        {
          let _s
          let v = obj[k]
          if (typeof v == "object" && v !== null && !(v instanceof Array) || (v instanceof Array && typeof v[0] == "object")){
            _s = s + k + "."
            eachRecursive.apply(this, [v,_s])
          }
          else
            _s = s + k
            let ui = document.getElementById(_s)
            if(ui){
              switch(ui.tagName){
                case "INPUT":
                  let labelc = ui.parentNode.nextSibling
                  let label = false
                  if(labelc && labelc.nodeName == "TD" && labelc.classList.contains("for-ui-labels")){
                    label = labelc.getElementsByTagName("input")[0]
                  }
                  if(ui.getAttribute("data-is-setting")){
                    if(label){
                      label.value = v
                    }
                    ui.value = v

                  }
                  else{
                    if(label){
                      label.value = Math.floor(v * 999)
                    }
                    ui.value = Math.floor(v * 999)
                  }
                  break
                case "SPAN":
                  ui.innerText = v
                  let customclass = ui.getAttribute("data-customclass") || false
                  if(customclass){
                    let options = ui.getAttribute("data-options").split(",")
                    for(let o in options){
                      document.body.classList.remove(customclass + "-" + options[o])
                    }
                    document.body.classList.add(customclass + "-" + ui.innerText)
                  }
                  break
                case "TR":
                  this.createList(_s);
                  break
              }
            }
        }
    }
    this.gui.scrollTo(this.guiPosition.x,this.guiPosition.y)
  }
  this.updateValue = function(string,number){
    let s = string.split(".")
    let n = Math.min(999,Math.max(0,Number(number))) / 999
    let t = this.config
    for(let i = 0; i < s.length - 1; i++){
      t = t[s[i]]
    }
    t[s[s.length - 1]] = n
    this.save()
  }
  this.updateSetting = function(string,setting){
    let s = string.split(".")
    let t = this.config
    for(let i = 0; i < s.length - 1; i++){
      t = t[s[i]]
    }
    t[s[s.length - 1]] = setting
    this.save()
  }
  this.setOption = function(string,value){
    let s = string.split(".")
    let t = this.config
    for(let i = 0; i < s.length - 1; i++){
      t = t[s[i]]
    }
    t[s[s.length - 1]] = value
    this.save()
  }
  this.toggleOption = function(string){
    let s = string.split(".")
    let t = this.config
    for(let i = 0; i < s.length - 1; i++){
      t = t[s[i]]
    }
    let flag = !t[s[s.length - 1]]
    t[s[s.length - 1]] = flag
    this.save()
    return flag
  }
  this.createList = function(id){
    let s = id.split(".")
    let t = this.config
    for(let i = 0; i < s.length - 1; i++){
      t = t[s[i]]
    }
    let list = t[s[s.length - 1]]
    let ui = document.getElementById(id)
    ui.innerHTML = ""
    let template = ui.getAttribute("data-template")
    let clear = document.createElement("td")
    let tooltip = template + "list"
    clear.classList.add("list-action")
    clear.innerText = "---"
    clear.addEventListener("mouseenter",function(e){
      e.target.innerText = "clr"
      this.handleTooltip(tooltip,e.clientX,e.clientY)
    }.bind(this))
    clear.addEventListener("mouseleave",function(e){
      e.target.innerText = "---"
      this.handleTooltip(false)
    }.bind(this))
    clear.addEventListener("click",function(){
      this.clearList(id)
    }.bind(this),id)
    ui.appendChild(clear)
    for(let _l in list){
      let l = list[_l]
      let item = document.createElement("span")
      switch(template){
        case "color":
          let input = document.createElement("input")
          input.classList.add("list-item")
          input.type = "color"
          input.spellcheck = "false"
          input.value = l
          input.id = id + "." + _l
          input.addEventListener("change",function(e){
            this.updateList(e.target.id,e.target.value,e.target)
          }.bind(this))
          item.appendChild(input)
          break
        case "fx":
          let fx = document.createElement("span")
          fx.classList.add("list-item")
          let options = ["drv","cmp","exp","rnd","bit"]
          let i = options.indexOf(l)
          fx.innerText = options[i]
          fx.id = id + "." + _l
          fx.addEventListener("click",function(e){
            i++
            let v = options[i % options.length]
            e.target.innerText = v
            this.updateList(e.target.id,e.target.innerText,e.target)
          }.bind(this),options,i)
          item.appendChild(fx)
          break
      }
      ui.appendChild(item)
    }

    let add = document.createElement("span")
    add.classList.add("list-action")
    add.innerText = "+"
    add.addEventListener("mouseenter",function(){
      this.innerText = "add"
    })
    add.addEventListener("mouseleave",function(){
      this.innerText = "+"
    })
    add.addEventListener("click",function(){
      this.addToList(id)
    }.bind(this),id)
    ui.appendChild(add)
  }
  this.clearList = function(id){
    let s = id.split(".")
    let t = this.config
    for(let i = 0; i < s.length - 1; i++){
      t = t[s[i]]
    }
    t[s[s.length - 1]] = []
    this.save()
    this.createList(id)
  }
  this.addToList = function(id){
    let s = id.split(".")
    let t = this.config
    for(let i = 0; i < s.length - 1; i++){
      t = t[s[i]]
    }
    let ui = document.getElementById(id)
    let template = ui.getAttribute("data-template")
    switch(template){
      case "color":
        t[s[s.length - 1]].push(this.config.settings.defaultColor)
        break
      case "fx":
        t[s[s.length - 1]].push(this.config.settings.defaultFx)
        break
    }
    this.save()
    this.createList(id)
  }
  this.updateList = function(id,value,sender){
    let s = id.split(".")
    let t = this.config
    for(let i = 0; i < s.length - 1; i++){
      t = t[s[i]]
    }
    t[s[s.length - 1]] = value
    this.save()
  }
  this.getValue = function(id){
    let s = id.split(".")
    let t = this.config
    for(let i = 0; i < s.length - 1; i++){
      t = t[s[i]]
    }
    return t[s[s.length - 1]]
  }
  this.initGUI = function(){
      [].slice.call(this.gui.getElementsByTagName('table')).forEach(function(table){
        let toggle = document.createElement("tr")
        toggle.classList.add("table-toggle")
        toggle.addEventListener("click",function(){
          table.classList.toggle("table-hidden")
        },table)
        table.appendChild(toggle)
      });
      [].slice.call(this.gui.getElementsByTagName('th')).forEach(function(th){
        let tooltip = th.getAttribute("data-tooltip")
        if(tooltip){
          th.addEventListener("mouseenter",function(e){
            this.handleTooltip(tooltip,e.clientX,e.clientY)
          }.bind(this),tooltip)
          th.addEventListener("mouseleave",function(e){
            this.handleTooltip(false)
          }.bind(this))
        }
      }.bind(this));
      this.updateGUI()
      eachRecursive.apply(this, [this.config,""])
      function eachRecursive(obj,s)
      {
          for (var k in obj)
          {
            let _s
            let v = obj[k]
            if (typeof v == "object" && v !== null && !(v instanceof Array) || (v instanceof Array && typeof v[0] == "object")){
              _s = s + k + "."
              eachRecursive.apply(this, [v,_s])
            }
            else
              _s = s + k
              let ui = document.getElementById(_s)
              if(ui){
                switch(ui.tagName){
                  case "INPUT":
                    //RANGES
                    if(ui.getAttribute("type") == "range"){
                      //CREATE LABEL
                      const td = ui.parentNode
                      const tr = td.parentNode
                      let ncont = document.createElement("td")
                      ncont.classList.add("for-ui-labels")
                      let n = document.createElement("input")
                      n.type = "number"
                      let min = Number(ui.min)
                      let max = Number(ui.max)
                      let mid = Math.floor((min+ max) * 0.5)
                      n.min = min
                      n.max = max
                      n.classList.add("slider-label")
                      n.value = ui.value
                      ncont.appendChild(n)

                      //LOOK FOR BUTTONSTAG
                      let buttons = !ui.getAttribute("data-no-buttons")
                      let ba,bb,bc,bd,bcont
                      //IF BUTTONS SHOULD BE GENERATED
                      if(buttons){
                        bcont = document.createElement("td")
                        bcont.classList.add("for-ui-buttons")
                        ba = document.createElement("span")
                        ba.innerHTML = "<"
                        bcont.appendChild(ba)
                        bb = document.createElement("span")
                        bb.innerHTML = "|"
                        bcont.appendChild(bb)
                        bc = document.createElement("span")
                        bc.innerHTML = ">"
                        bcont.appendChild(bc)
                        let space = document.createElement("span")
                        space.innerHTML = " "
                        bcont.appendChild(space)
                        bd = document.createElement("span")
                        bd.innerHTML = "*"
                        bcont.appendChild(bd)
                      }
                      //APPEND LABELS AND OPTIONAL BUTTONS
                      if(td.nextSibling){
                        if(buttons){
                          tr.insertBefore(bcont, td.nextSibling)
                        }
                        tr.insertBefore(ncont, td.nextSibling)
                      }
                      else{
                        tr.appendChild(ncont)
                        if(buttons){
                          tr.appendChild(bcont)
                        }
                      }
                      //FOR SETTINGS
                      if(ui.getAttribute("data-is-setting")){
                        n.addEventListener("change",function(e){
                          let v = e.target.value
                          let min = Number(e.target.min) || 0
                          let max = Number(e.target.max) || false
                          if(v < min){
                            v = min
                          }
                          if(max && v > max){
                            v = max
                          }
                          e.target.value = v
                          ui.value = v
                          this.updateSetting(ui.id,v)
                        }.bind(this),ui)
                        ui.addEventListener("change",function(e){
                          n.value = e.target.value
                          this.updateSetting(e.target.id,e.target.value)
                        }.bind(this),n)
                        if(buttons){
                          ba.addEventListener("click",function(e){
                            n.value = min
                            ui.value = min
                            this.updateSetting(ui.id,min)
                          }.bind(this),n,ui,min)
                          bb.addEventListener("click",function(e){
                            n.value = mid
                            ui.value = mid
                            this.updateSetting(ui.id,mid)
                          }.bind(this),n,ui,mid)
                          bc.addEventListener("click",function(e){
                            n.value = max
                            ui.value = max
                            this.updateSetting(ui.id,max)
                          }.bind(this),n,ui,max)
                          bd.addEventListener("click",function(e){
                            let v = min + Math.floor(Math.random() * max)
                            n.value = v
                            ui.value = v
                            this.updateSetting(ui.id,v)
                          }.bind(this),n,ui,min,max)

                        }
                      }
                      //FOR NON-SETTINGS
                      else{
                        n.addEventListener("change",function(e){
                          let v = e.target.value
                          let min = Number(e.target.min) || 0
                          let max = Number(e.target.max) || false
                          if(v < min){
                            v = min
                          }
                          if(max && v > max){
                            v = max
                          }
                          e.target.value = v
                          ui.value = v
                          this.updateValue(ui.id,v)
                        }.bind(this),ui)
                        ui.addEventListener("change",function(e){
                          n.value = e.target.value
                          this.updateValue(e.target.id,e.target.value)
                        }.bind(this),n)
                        if(buttons){
                          ba.addEventListener("click",function(e){
                            n.value = min
                            ui.value = min
                            this.updateValue(ui.id,min)
                          }.bind(this),n,ui,min)
                          bb.addEventListener("click",function(e){
                            n.value = mid
                            ui.value = mid
                            this.updateValue(ui.id,mid)
                          }.bind(this),n,ui,mid)
                          bc.addEventListener("click",function(e){
                            n.value = max
                            ui.value = max
                            this.updateValue(ui.id,max)
                          }.bind(this),n,ui,max)
                          bd.addEventListener("click",function(e){
                            let v = min + Math.floor(Math.random() * max)
                            n.value = v
                            ui.value = v
                            this.updateValue(ui.id,v)
                          }.bind(this),n,ui,min,max)
                        }
                      }
                    }
                    //OTHER INPUTS
                    else{
                      //OTHER SETTINGS
                      if(ui.getAttribute("data-is-setting")){
                        ui.addEventListener("change",function(e){
                          this.updateSetting(e.target.id,e.target.value)
                        }.bind(this))
                      }
                      //OTHER NON-SETTINGS
                      else{
                        ui.addEventListener("change",function(e){
                          this.updateValue(e.target.id,e.target.value)
                        }.bind(this))
                      }
                    }
                    break
                  case "SPAN":
                    let options = ui.getAttribute("data-options").split(",")
                    let customclass = ui.getAttribute("data-customclass") || false
                    if(customclass){
                      document.body.classList.add(customclass + "-" + ui.innerText)
                    }
                    let i = 0 || options.indexOf(ui.innerText)
                    ui.addEventListener("click",function(e){
                      if(customclass){
                        document.body.classList.remove(customclass + "-" + e.target.innerText)
                      }
                      i++
                      let v = options[i % options.length]
                      e.target.innerText = v
                      if(customclass){
                        document.body.classList.add(customclass + "-" + v)
                      }
                      this.setOption(e.target.id,v)
                    }.bind(this),options,i,customclass)
                    break
                  case "TH":
                    let ot = ui.innerText
                    let flag = this.getValue(ui.id)
                    if(flag){
                      ui.classList.add("toggle-active")
                    }
                    else{
                      ui.classList.remove("toggle-active")
                    }
                    ui.classList.add("toggle-action")
                    ui.addEventListener("mouseenter",function(e){
                      e.target.innerText = "I/O"
                    })
                    ui.addEventListener("mouseleave",function(e){
                      e.target.innerText = ot
                    },ot)
                    ui.addEventListener("click",function(e){
                      let flag = this.toggleOption(e.target.id)
                      if(flag){
                        ui.classList.add("toggle-active")
                      }
                      else{
                        ui.classList.remove("toggle-active")
                      }
                    }.bind(this))
                    break
                  case "TR":
                    break
                }

              }
          }
    }
  }
  this.init = function(){
    this.gui = document.getElementById("gui")
    this.gui.addEventListener("scroll",function(){
      this.guiPosition.x = this.gui.scrollLeft
      this.guiPosition.y = this.gui.scrollTop
    }.bind(this))
    this.ipc.on("requireUpdate", function () {
      this.update()
    }.bind(this));
    this.ipc.on("requireHideGUI", function () {
      this.hide()
    }.bind(this));
    this.ipc.on("requireShowGUI", function () {
      this.show()
    }.bind(this));
    this.ipc.on("requireToggleGUI", function () {
      this.toggle()
    }.bind(this));
    this.update()
  }
  this.init()

}
