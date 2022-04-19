/*
<Button callback="()=>{}" icon="*"/>
*/
import React from 'react';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  text(){
    return this.props.useShorts && this.props.short ? this.props.short : this.props.text
  }
  render() {
    let classNames = this.props.className ? this.props.className.split(" ") : []
    if(this.props.text){
      classNames.push("auto")
    }
    if(this.props.active){
      classNames.push("active")
    }
    return (
      <button className={classNames.join(" ")} onClick={this.props.callback}>{this.text() || this.props.icon}</button>
    );
  }
}
