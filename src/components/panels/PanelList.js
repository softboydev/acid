/*
<Slider value="" name="Name" short="XXX" useShorts="false" min="0" max="999" absolute="false" showButtons="false" showLabels="false" showTooltips="false" showInput="false" description="Description"/>,
*/
import React from 'react';
import {Nametag,Button,Help} from "../atoms/atoms.js"

export default class PanelList extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.value
  }
  send(){
    this.props.callback.apply(null,[this.props.target,this.state])
  }
  update(n,v){
    this.setState(state => {
      const list = state.list.map((item, j) => {
        if (j === n) {
          return v
        } else {
          return item;
        }
      })
      return {
        list
      }
    },()=>{this.send()})
  }
  add(){
    this.setState((state,props)=> {
      let item = {...props.default}
      item.id = state.list.length != null ? state.list.length : 0
      const list = state.list.concat(item);
      return {
        selected:state.selected,
        list:list
      }
    },()=>{this.send()})
  }
  remove(){
    if(this.state.list.length){
      this.destroy(this.state.list.length - 1)
    }
  }
  clear(){
    this.setState({list: []},()=>{this.send()})
  }
  up(n){
    if(n > 0){
      this.move(n,n-1)
    }
  }
  down(n){
    if(n < this.state.list.length - 1){
      this.move(n,n+1)
    }
  }
  destroy(n){
    this.setState(state => {
      let selected = state.selected == n.id ? -1 : state.selected
      const list = state.list.filter((item, j) => n != j);
      return {
        selected:selected,
        list:list
      }
    },()=>{this.send()})
  }
  select(n){
    this.setState(state => {
      return {
        selected: state.selected == n.id ? -1 : n.id
      }
    },()=>{this.send()})
  }
  move(from,to){
    this.setState(state => {
      let list = [...this.state.list]
      list.splice(to, 0, list.splice(from, 1)[0])
      return {
        selected:state.selected,
        list:list
      }
    },()=>{this.send()})
  }
  selectable(){
    return this.props.overview != null
  }
  selected(id){
    return this.state.selected != null ? this.state.selected == id : false
  }
  controlled(){
    return this.props.controller != null
  }
  actions(){
    return this.props.actions != null ? this.props.actions : true
  }
  static getDerivedStateFromProps(props, state) { // for controlled lists
    if(props.controller != null){ //check if list is conrolled
      if(props.controller.list != state.list){ //checks if controller list has derived
        let plist = state.list //clone own list
        let clist = [...props.controller.list] //clone controller list
        let list = []
        for(let e in state.list){ //iterate over all entrys in panel list
          if(clist[e]) {//when the controller list has an entry at that key
            let entry = {...state.list[e]} //create entry clone
            list.push(entry) //push new entry into list
          }
        }
        for(let e in clist){ //iterate over all entrys in controller list
          let centry = {...clist[e]} //clone entry
          let entry = list[e] ? {...list[e]} : {...props.default} //either clone existing entry or create new from default
          for(let k in centry){ //for each key in controller entry
            entry[k] = centry[k] //overwrite keys that exist in controller entry (keys that only exist in own entry are left untouched)
          }
          list[e] = entry //store edited entry back into the list
        }
        return { //return updated state
          selected:state.selected,
          list:list
        }
      }
      else{
        return null; // No change to state
      }
    }
    else{
      return null
    }
  }
  render() {
    const Component = this.props.template
    const Overview = this.props.overview
    const structure = this.props.default
    let listItems = this.state.list.map((n,i) =>
      <tr key={n.id.toString()}>
      {!this.selectable() || this.selected(n.id) ?
        <Component{...n } channels={this.props.channels} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs} structure={structure} callback={this.update.bind(this,i)}/>
        : <Overview{...n } useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs} structure={structure} callback={this.update.bind(this,i)}/>
      }
      {!this.controlled()  && this.actions() &&
        <td>
          <Button callback={this.up.bind(this,i)} icon="&#9650;"/>
          <Button callback={this.down.bind(this,i)} icon="&#9660;"/>
          <Button callback={this.destroy.bind(this,i)} icon="-"/>
        </td>
      }

        {this.selectable() &&
          <td>
            <Button callback={this.select.bind(this,n)} text="Edit" active={n.id == this.state.selected}/><br></br>
          </td>
        }
      </tr>
    );
    return (
      <React.Fragment>
      {listItems}
      <tr key="buttons">
      {!this.controlled() &&
        <React.Fragment>
          <Button callback={this.add.bind(this)} icon="+"/>
          <Button callback={this.remove.bind(this)} icon="-"/>
          <Button callback={this.clear.bind(this)} icon="C"/>
        </React.Fragment>
      }
      {this.props.showTooltips &&
      <Help description={this.props.description}/>
      }
      </tr>
      </React.Fragment>
    );
  }
}
