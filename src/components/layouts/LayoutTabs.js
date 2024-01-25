import React from 'react';
import LayoutTab from "./LayoutTab"
import {Button} from "../atoms/atoms.js"

export default class LayoutTabs extends React.Component {
  classnames(){
    return "container " + this.props.tabs
  }
  select(tab){
    this.props.select(this.props.tabs,tab)
  }
  tabs(){
    let tabs = []
    let children = {...this.props.children}
    for(let c in children){
      let child = children[c]
      console.log(child);
      if(child.type === LayoutTab){
        tabs.push(this.props.useShorts ? child.props.short : child.props.name)
      }
    }
    return tabs
  }
  selected(){
    return this.props.tab
  }
  render(){
    let tabs = this.tabs()
    let buttons = tabs.map((tab, i) =>{
      return <Button className="tab" key={i} callback={this.select.bind(this,i)} text={tab} active={this.selected() == i}/>
    })
    return(
      <div className={this.classnames()}>
        <div className="container head">
          {buttons}
        </div>
        <div className="container body">
          {this.props.children}
        </div>
      </div>
    )
  }
}
