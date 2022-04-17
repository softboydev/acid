/*
<Toggle value="2" name="Name" short="XXX" useShorts="false" showTooltips="true" description="Description"/>
*/
import React from 'react';

export default class ListItem extends React.Component {
  constructor(props) {
    super(props)
    let structure =  {
      ...this.props.structure
    }
    structure.id = 0
    for(let k of Object.keys(structure)){
      if(this.props[k]){
        structure[k] = this.props[k]
      }
    }
    this.state = structure
  }
  update(key,v){
    console.log(key,v);
    this.setState({[key]:v},() => {
      this.props.callback(this.state)
    })
    // this.setState((state) => {
    //   state[key] = v
    //   this.props.callback(state)
    // })
  }
}
