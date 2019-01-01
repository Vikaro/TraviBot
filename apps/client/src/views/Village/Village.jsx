import React, { Component } from 'react'
import { view } from 'react-easy-state';
import appStore from 'store/store';

export default view(class Village extends Component {
  state = {
     village: appStore.villages[15230]

  };  
  componentDidMount(){

  }
  render() {
      const village = this.state.village;

    return (
      <div>
        Name: {village.name}
        Id: {village.id}
        isActibe: {village.isActive}
      </div>
    )
  }
});
