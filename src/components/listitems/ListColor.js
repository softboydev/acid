/*
<Number min="0" max="1" step="0.1" relative="true" callback="()=>{}" value="0.5"/>
*/
import React from 'react';
import {Color} from "../atoms/atoms.js"
import ListItem from "./ListItem"

export default class ListColor extends ListItem {
  render() {
    return (
      <td><Color value={this.state.value} callback={this.update.bind(this,"value")}></Color></td>
    );
  }
}
