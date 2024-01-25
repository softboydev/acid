/*
<Nametag name="Example" short="Exm" useShorts="false"/>
*/
import React from 'react';

export default class Nametag extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span>{this.props.useShorts ? this.props.short : this.props.name}</span>
    );
  }
}
