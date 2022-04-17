import React from 'react';
import './css/UI.css'
import {PanelSlider,PanelToggle,PanelOption,PanelList,ListColor,ListLayer} from './components/components.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preset: 0,
      ui:{
        preferences: {
          useShorts: true,
          showTooltips: true,
          showLabels: true,
          showButtons: true
        },
        defaults: {
          color: "#ffffff",
          effect: 0,
        },
        states: {

        }
      },
      presets: [

      ]
    }
  }
  update(target,value){
    this.setState(function(state){
      let path = target.split(".") //creates a path array from the passed target identifier
      let dest = state //creates a copy of the statecopy to search trough recursively
      for(let i = 0; i < path.length - 1; i++){ //for all path components but the last
        if(dest[path[i]] !== undefined){ //check if the path is still reachable
          dest = dest[path[i]] //store a reference recursively
        }
        else{ //if the path cant be reached return
          return
        }
      }
      dest[path[path.length - 1]] = value //set the value of the final destination
      return state
    })
  }
  render() {
    return (
      <main>
        <table class="section ui">
        <tbody>
          <tr>
            <th>
          <PanelToggle name="Shortcuts" short="Cut"
            target="ui.preferences.useShorts"
            value={this.state.ui.preferences.useShorts}
            callback={this.update.bind(this)} useShorts={this.state.ui.preferences.useShorts} showTooltips={this.state.ui.preferences.showTooltips}
            description="Toggles the usage of abbreviations"
          />
          <PanelToggle name="Tooltips" short="Tip"
            target="ui.preferences.showTooltips"
            value={this.state.ui.preferences.showTooltips}
            callback={this.update.bind(this)} useShorts={this.state.ui.preferences.useShorts} showTooltips={this.state.ui.preferences.showTooltips}
            description="Toggles the display of tooltips"
          />
          <PanelToggle name="Labels" short="Lbl"
            target="ui.preferences.showLabels"
            value={this.state.ui.preferences.showLabels}
            callback={this.update.bind(this)} useShorts={this.state.ui.preferences.useShorts} showTooltips={this.state.ui.preferences.showTooltips}
            description="Toggles the usage of labels"
          />
          <PanelToggle name="Buttons" short="Btn"
            target="ui.preferences.showButtons"
            value={this.state.ui.preferences.showButtons}
            callback={this.update.bind(this)} useShorts={this.state.ui.preferences.useShorts} showTooltips={this.state.ui.preferences.showTooltips}
            description="Toggles the usage of buttons"
          />
          <PanelOption name="Default Effect" short="Dfx"
            target="ui.defaults.effect"
            option={this.state.ui.defaults.effect}
            options={["Overdrive","Compressor","Expander","Randomize","Bitcrusher"]}
            optionsShort={["Ovd","Cmp","Exp","Rnd","Bit"]}
            callback={this.update.bind(this)} useShorts={this.state.ui.preferences.useShorts} showTooltips={this.state.ui.preferences.showTooltips}
            description="Selects the default effect"
          />
          </tbody>
        </table>
          <table>
          <tbody>
          <tr>
            <th>uid</th>
            <th>Mix</th>
            <th>Opacity</th>
            <th>Visible</th>
            <th>Edit</th>
          </tr>
          <PanelList name="Sources" short="SRC"
            target="ui.preferences.sources"
            value={this.state.ui.preferences.sources}
            template={ListLayer} default={{mix: 0,opacity: 0,active: true,test:0}}
            callback={this.update.bind(this)} useShorts={this.state.ui.preferences.useShorts} showTooltips={true}
            description="Description"
          />
          </tbody>
        </table>
        this.state.list.map((n,i) =>
          <tr key={n.id.toString()}>
            <td>{i}</td><Component{...n } useShorts={this.props.useShorts} structure={structure} callback={this.update.bind(this,i)}/>
            <td>
              <Button callback={this.up.bind(this,i)} icon="&#9650;"/>
              <Button callback={this.down.bind(this,i)} icon="&#9660;"/>
              <Button callback={this.destroy.bind(this,i)} icon="-"/>
            </td>
          </tr>
        );
      </main>
    )
  }
}

export default App;
