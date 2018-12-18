import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Header from './components/header/header'
import BuildList from './components/buildList/buildlist'

export default class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { username } = this.state;
    return (
      <div>
        <Header />
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        {/* <img src={ReactImage} alt="react" /> */}
        <BuildList/>
      </div>
    );
  }
}
