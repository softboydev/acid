import React from 'react';
import {AcidWrapper} from '../acid/wrapper';

class Acid extends React.Component {
  componentDidMount(){
    new AcidWrapper()
  }
}

export default Acid;
