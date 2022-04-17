/*
<Slider value="" name="Name" short="XXX" useShorts="false" min="0" max="999" absolute="false" showButtons="false" showLabels="false" showTooltips="false" showInput="false" description="Description"/>,
*/
import React from 'react';

export default class Module extends React.Component {
  constructor(props) {
    super(props)
    this.state = props
  }
  update(k,v){
    this.setState({[k]:v},() => {
      let target = this.props.target + "." + k
      this.props.callback.apply(null,[target,v])
    })
  }
}
