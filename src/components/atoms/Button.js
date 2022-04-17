/*
<Button callback="()=>{}" icon="*"/>
*/
import React from 'react';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let classNames = []
    if(this.props.text){
      classNames.push("auto")
    }
    if(this.props.active){
      classNames.push("active")
    }
    return (
      <button className={classNames.join(" ")} onClick={this.props.callback}>{this.props.text || this.props.icon}</button>
    );
  }
}
