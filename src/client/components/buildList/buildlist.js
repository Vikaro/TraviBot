import {PickList} from 'primereact/picklist';
import React, {Component} from 'react';

export default class BuildList extends Component {
    state = {
        cars : [{Name: "aa", Value: "bb"}],
        targetCars : [],
    }
    carTemplate = (car) => {
        return (
            <div className="p-clearfix">
                <div style={{ fontSize: '14px', float: 'right', margin: '15px 5px 0 0' }}>{car.Name} - {car.Value}</div>
            </div>
        );
    }
    onChange = (event) => {
        this.setState({
            cars: event.source,
            targetCars: event.target
        });
    }
    render(){
        return(
            <PickList source={this.state.cars} target={this.state.targetCars} itemTemplate={this.carTemplate} 
            onChange={this.onChange} />
        )
    }
}