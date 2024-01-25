/*
<Toggle value="2" name="Name" short="XXX" useShorts="false" showTooltips="true" description="Description"/>
*/
import React from 'react';
import {Nametag,Toggle,Help,Option} from "../atoms/atoms.js"

export default class PanelOption extends React.Component {
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
          <Option callback={this.update.bind(this)} option={this.props.option} options={this.props.options} optionsShort={this.props.optionsShort} useShorts={this.props.useShorts}/>
        </td>
        {(this.props.showInputs) &&
        <td>

        </td>
        }
        {this.props.showTooltips &&
        <td class="left">
          <Help description={this.props.description}/>
        </td>
        }
      </tr>
    );
  }
}
