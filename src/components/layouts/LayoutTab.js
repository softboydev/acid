import React from 'react';
import {Button} from "../atoms/atoms.js"

export default class LayoutTab extends React.Component {
  selected(){
    return this.props.tabs == this.props.tab
  }
  render(){
    return this.selected() ? this.props.children : null
  }
}
