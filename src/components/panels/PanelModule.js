/*
<Slider value="" name="Name" short="XXX" useShorts="false" min="0" max="999" absolute="false" showButtons="false" showLabels="false" showTooltips="false" showInput="false" description="Description"/>,
*/
import React from 'react';
import {PanelOption} from "./panels.js"

export default class PanelModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.value
  }
  send(){
    console.log(this.state);
    this.props.callback.apply(null,[this.props.target,this.state])
  }
  update(index,target,value){
    this.setState(state => {
      let _list = [...state.list]
      let mod = {..._list[index]}
      mod[target] = value
      const list = state.list.map((item, j) => {
        if (j === index) {
          return mod
        } else {
          return item;
        }
      })
      return {
        list
      }
    //   mod[target[1]][target[2]] = value;
    //   console.log(list,mod);
    //   console.log(list[0][target[1]][target[2]])
    //   console.log(list[target[0]][target[1]][target[2]])
    //   return {}
    // console.log(target);
    // // 1. Make a shallow copy of the items
    // let list = [...this.state.list];
    // console.log(list);
    // // 2. Make a shallow copy of the item you want to mutate
    // let mod = {...list[target[0]]};
    // // 3. Replace the property you're intested in
    // mod[target[1]][target[2]] = value;
    // console.log(mod);
    // // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    // console.log(list);
    // list[target[0]] = mod;
    // console.log(list);
    // // 5. Set the state to our new copy
    // this.setState({list
    // console.log(target);
    // this.setState(function(state){
    //   let list = {...state}.list
    //   list[target[0]][target[1]][target[2]] = value
    //   console.log(list);
      // let container = {...state}
      // let module = container.list[index]
      // let path = target.split(".") //creates a path array from the passed target identifier
      // let dest = {...module}
      // for(let i = 0; i < path.length - 1; i++){ //for all path components but the last
      //   if(dest[path[i]] !== undefined){ //check if the path is still reachable
      //     dest = dest[path[i]] //store a reference recursively
      //     console.log(dest);
      //   }
      //   else{ //if the path cant be reached return
      //     return
      //   }
      // }
      // dest[path[path.length - 1]] = value //set the value of the final destination
      // console.log(container);
      // container.list[index] = module
      // console.log(container);
      // return container
      // let path = target.split(".")
      // let s = {...state}
      // let mod = {...s.list[index]}
      // let m = mod
      // for(let i = 0; i < path.length - 1; i++){
      //   if(m[path[i]] !== undefined){
      //     m = m[path[i]]
      //   }
      //   else{
      //     return
      //   }
      // }
      // m[path[path.length - 1]] = value
      // s.list[index] = mod
      // console.log(s);
      // return {list:list}
      // console.log(modules);
      // for(let m of modules){
      //   console.log(m);
      //   if(m.id == index){
      //     console.log(m);
      //   }
      // }
    },()=>{this.send()})
  }
  static getDerivedStateFromProps(props, state) {
    return props.value
    // if(props.value.list.length !== state.list.length) {
    //   console.log("override derived state");
    //   return {list:props.value.list}
    // }
    // if (props.value.selected !== state.selected) {
    //   console.log("override derived state");
    //   console.log(props.value.selected);
    //   return {selected:props.value.selected}
    // }
    // return null
  }
  render() {
    console.log(this.state.selected);
    let module = this.state.list[this.state.selected]
    let index = this.state.selected
    console.log(module);
    return (
      <React.Fragment>
      {index}
      <PanelOption key={String(index)}name="Type" short="Typ"
        target="type"
        option={module.type}
        options={["Triangle","Square","Sine"]}
        optionsShort={["Tri","Sqr","Sin"]}
        callback={this.update.bind(this,index)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the clipping behaviour for this channel"
      />
      </React.Fragment>
    )
  }
}
