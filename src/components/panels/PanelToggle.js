/*
<Toggle value="2" name="Name" short="XXX" useShorts="false" showTooltips="true" description="Description"/>
*/
import React from 'react';
import {Nametag,Toggle,Help,Option} from "../atoms/atoms.js"

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
          <Toggle callback={this.update.bind(this)} value={this.props.value}/>
        </td>
        {(this.props.showInputs) &&
        <td>

        </td>
        }
        {(this.props.showButtons || this.props.showTooltips) &&
          <td className="left">
            {this.props.showTooltips &&
            <Help description={this.props.description}/>
            }
          </td>
        }
      </tr>
    );
  }
}
