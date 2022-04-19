import React from 'react';
import '../css/UI.css'
import {
  PanelSlider,PanelToggle,PanelOption,PanelList,PanelTable,PanelSection,PanelModule,
  ListColor,ListLayer,ListWindow,ListWindowOverview,ListChannel,ListChannelOverview,ListLayerOverview,
  LayoutTabs,LayoutTab
} from '../components/components.js'
import {Nametag,Color,Button,Help} from '../components/atoms/atoms.js'

const storage = window.require('electron-json-storage')
const { ipcRenderer } = window.require("electron");
const ipc = ipcRenderer

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: { //states for various toggleable ui elements
        left:0,
        right:0
      },
      running: false, //toggles for playpause
      frame: 0, //frame counter
      length: 0, //maximum frame length
      settings:{ //global settings
        ui:{ //settings for the ui
          preferences: { //Stores UI Preferences
            useShorts: true, //Shortcuts
            showTooltips: true, //Tooltips
            showLabels: true, //Labels
            showButtons: true, //Buttons
            showInputs: true
          }
        },
        clock: { //settings for clocking
          recieve: false, //toggled to allow external midi clocking
          send: false, //toggled to send midi clock
          bpm: 128, //bpm to set the internal clock too
          div: 0, //beatdivision for bpm
        },
        export: {
          start: 0, //starting frame for export
          end: 0//ending frame for export
        }
      },
      defaults: { //storage for various default values, some exposed others arent
        color: "#ffffff", //Defaultcolor
         //Defaulteffect
        window: { //defaultwindow
          id:0,
          short:"Win",
          label: "Window", //ui label
          framerate: 10, //fps
          resolution: 0.2, //dots per pixel
          relative: false //if the resolution is relative to viewport
        },
        channel: {
          id:0,
          short:"Cha",
          label: "Channel", //uilabel
          min: 0, //minimum value
          max: 1, //max value
          mod: 1, //allowed mod between min and max
          clipping: 0, //clipping mode
        },
        layer: {
          id:0,
          enabled: true, //if the layer is enabled
          opacity: 1, //opacity of the layers
          short: "Lay", //uiindex
          label: "Layer", //uilabel
          type: 0, //sets the layertype
          frequency: 0,
          offset: 0,
          drift: 0.5,
          rotation: 0,
          center: 0.5,
          shape: 0,
          xfrequency: 0,
          xoffset: 0,
          yfrequency: 0,
          yoffset: 0,
          zfrequency: 0,
          zoffset: 0,
          min: 0, //floor values
          max: 1, //ceiling value
          lpf: 1, //low pass filter
          hpf: 0, //hi pass filter
          mixer: true, //if the mixer is to be bypassed and global send is to be used instead
          send: 1, //global send used in bypass mode
          mix: 0, //global mixmode used in bypass mixmode
          channels: {
            selected: -1,
            list: []
          }, //array of all channel settings
          effects: true, //bypasses all effects
          drywet: 1, //mixes between effects
          inserts: {
            selected:-1,
            list: []
          }, //array for the effects chain
          defaults:{
            effect: {
              type: 0,
              send: 1,
              bypass: false
            },
            channel: {
              id:0,
              short:"Cha",
              label: "Channel",
              send: 1,
              bypass: false,
              mix: 0
            }
          }
        }
      },
      outputs: { //various output formats
        windows: {
          list: [],
          selected: -1
        } //array of windows
      },
      inputs: {
        devices: [], //array of midi devices,
        logs: [], //midilog objects
        midis: [] //list of all midi messages we listen to
      },
      channels: {
        list: [],
        selected: -1
      },
      layers: {
        list: [],
        selected: -1
      },
      render:{
        mode: 0,
      }
      //mastersettings
      //rendersettings
    }
    // this.fetch()
  }
  shorts(){
    return this.state.settings.ui.preferences.useShorts
  }
  tips(){
    return this.state.settings.ui.preferences.showTooltips
  }
  inputs(){
    return this.state.settings.ui.preferences.showInputs
  }
  buttons(){
    return this.state.settings.ui.preferences.showButtons
  }
  labels(){
    return this.state.settings.ui.preferences.showLabels
  }
  fetch(callback){
    storage.get("config", function(error, data) {
      if(error){
        throw error
      }
      else if(Object.keys(data).length){
        this.setState(JSON.parse(data))
      }
    }.bind(this));
  }
  update(target,value){
    this.setState(function(state){ //recieve a state object
      let path = target.split(".") //creates a path array from the passed target identifier
      let dest = {...state}
      for(let i = 0; i < path.length - 1; i++){ //for all path components but the last
        if(dest[path[i]] !== undefined){ //check if the path is still reachable
          dest = dest[path[i]] //store a reference recursively
        }
        else{ //if the path cant be reached return
          return
        }
      } //all objects are the same! we need a deep clone
      dest[path[path.length - 1]] = value //set the value of the final destination
      return dest
    },()=>{
      storage.set("config", JSON.stringify(this.state), function(error) {
        if (error){
          throw error
        }
        else{
          ipc.send("requestUpdate","")
        }
      }.bind(this))
    })
  }
  tab(tabs,tab){
    this.setState(function(state){
      let t = {...state.tabs}
      t[tabs] = tab
      return {
        tabs: t
      }
    },()=>{
      console.log(this.state);
    })
  }
  render() {
    return (
      <main>
      <LayoutTabs tabs="left" tab={this.state.tabs.left} select={(tabs,tab) => this.tab(tabs,tab)} >
        <LayoutTab tab={0} tabs={this.state.tabs.left} name="Settings" short="Set">
          <PanelTable name="Settings" short="SET" useShorts={this.shorts()}>
            <PanelSection name="UI/UX" short="UIX" useShorts={this.shorts()}>
              <PanelToggle name="Shortcuts" short="Cut"
                target="settings.ui.preferences.useShorts"
                value={this.state.settings.ui.preferences.useShorts}
                callback={this.update.bind(this)} useShorts={this.shorts()} showTooltips={this.tips()}  showInputs={this.inputs()}
                description="Toggles the usage of abbreviations"
              />
              <PanelToggle name="Tooltips" short="Tip"
                target="settings.ui.preferences.showTooltips"
                value={this.state.settings.ui.preferences.showTooltips}
                callback={this.update.bind(this)} useShorts={this.shorts()} showTooltips={this.tips()}  showInputs={this.inputs()}
                description="Toggles the display of tooltips"
              />
              <PanelToggle name="Labels" short="Lbl"
                target="settings.ui.preferences.showLabels"
                value={this.state.settings.ui.preferences.showLabels}
                callback={this.update.bind(this)} useShorts={this.shorts()} showTooltips={this.tips()}  showInputs={this.inputs()}
                description="Toggles the usage of labels"
              />
              <PanelToggle name="Buttons" short="Btn"
                target="settings.ui.preferences.showButtons"
                value={this.state.settings.ui.preferences.showButtons}
                callback={this.update.bind(this)} useShorts={this.shorts()} showTooltips={this.tips()}  showInputs={this.inputs()}
                description="Toggles the usage of buttons"
              />
              <PanelToggle name="Inputs" short="Inp"
                target="settings.ui.preferences.showInputs"
                value={this.state.settings.ui.preferences.showInputs}
                callback={this.update.bind(this)} useShorts={this.shorts()} showTooltips={this.tips()}  showInputs={this.inputs()}
                description="Toggles the usage of direct inputs"
              />
            </PanelSection>
            <PanelSection name="Clock" short="CLK" useShorts={this.shorts()}>
              <PanelToggle name="Recieve Clock" short="REC"
                target="settings.clock.recieve"
                value={this.state.settings.clock.recieve}
                callback={this.update.bind(this)} useShorts={this.shorts()} showTooltips={this.tips()}  showInputs={this.inputs()}
                description="Toggles recieiving external MIDI clock"
              />
              <PanelToggle name="Send Clock" short="SND"
                target="settings.clock.send"
                value={this.state.settings.clock.send}
                callback={this.update.bind(this)} useShorts={this.shorts()} showTooltips={this.tips()}  showInputs={this.inputs()}
                description="Toggles sending MIDI clock"
              />
              <PanelSlider name="BPM" short="Bpm"
                target="settings.clock.bpm"
                value={this.state.settings.clock.bpm}
                min={10} max={600} relative={false}
                callback={this.update.bind(this)} useShorts={this.shorts()} showButtons={this.buttons()} showLabels={this.labels()} showTooltips={this.tips()} showInputs={this.inputs()}
                description="Sets the desired bpm to use as clocking"
              />
            </PanelSection>
          </PanelTable>
        </LayoutTab>
        <LayoutTab tab={1} tabs={this.state.tabs.left} name="Outputs" short="Out" useShorts={this.shorts()}>
          <PanelTable name="Outputs" short="Out" useShorts={this.shorts()}>
            <PanelSection name="Windows" short="Win" useShorts={this.shorts()}>
              <PanelList name="Windows" short="Win"
                target="outputs.windows"
                value={this.state.outputs.windows}
                template={ListWindow} overview={ListWindowOverview} default={this.state.defaults.window} //we are here
                callback={this.update.bind(this)} useShorts={this.shorts()} showButtons={this.buttons()} showLabels={this.labels()} showTooltips={this.tips()} showInputs={this.inputs()}
                description="List of all output windows. Create and destroy them here as well."
              />
            </PanelSection>
          </PanelTable>
        </LayoutTab>
        <LayoutTab tab={2} tabs={this.state.tabs.left} name="Channels" short="Chn" useShorts={this.shorts()}>
          <PanelTable name="Channels" short="Chn" useShorts={this.shorts()}>
              <PanelList name="Channels" short="Ch"
                target="channels"
                value={this.state.channels} actions={false}
                template={ListChannel} overview={ListChannelOverview} default={this.state.defaults.channel} //we are here
                callback={this.update.bind(this)} useShorts={this.shorts()} showButtons={this.buttons()} showLabels={this.labels()} showTooltips={this.tips()} showInputs={this.inputs()}
                description="List of all mixer channels."
              />
          </PanelTable>
        </LayoutTab>
      </LayoutTabs>
      <LayoutTabs tabs="right" tab={this.state.tabs.right} select={(tabs,tab) => this.tab(tabs,tab)} >
        <LayoutTab tab={0} tabs={this.state.tabs.right} name="Channels" short="Chn" useShorts={this.shorts()}>
          <PanelTable name="Layers" short="Lay" useShorts={this.shorts()}>
              <PanelList name="Layers" short="Lay"
                target="layers"
                value={this.state.layers} channels={this.state.channels}
                template={ListLayer} overview={ListLayerOverview} default={this.state.defaults.layer} //we are here
                callback={this.update.bind(this)} useShorts={this.shorts()} showButtons={this.buttons()} showLabels={this.labels()} showTooltips={this.tips()} showInputs={this.inputs()}
                description="List of all layers. Click on one to select for editing."
              />
          </PanelTable>
        </LayoutTab>
        <LayoutTab tab={1} tabs={this.state.tabs.right} name="Channels" short="Chn" useShorts={this.shorts()}>
          Test
        </LayoutTab>
      </LayoutTabs>
      </main>
    )
  }
}

export default UI;
