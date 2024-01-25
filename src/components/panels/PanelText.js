/*
<Toggle value="2" name="Name" short="XXX" useShorts="false" showTooltips="true" description="Description"/>
*/
import React from 'react';
import {Nametag,Help,Text} from "../atoms/atoms.js"

export default class PanelToggle extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { seconds: 0 };
  }
  update(v){
    this.props.callback.apply(null,[this.props.target,v])
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <tr>
        <th>
          <Nametag name={this.props.name} short={this.props.short} useShorts={this.props.useShorts}/>
        </th>
        <td>
          <Text callback={this.update.bind(this)} max={this.props.max || 30} value={this.props.value}/>
        </td>
        {(this.props.showInputs) &&
        <td>

        </td>
        }
        {(this.props.showButtons || this.props.showTooltips) &&
        <td class="left">
          {this.props.showTooltips &&
          <Help description={this.props.description}/>
          }
        </td>
        }
      </tr>
    );
  }
}
