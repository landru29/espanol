import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Game from './game/game';
import { Service, Vocabulary } from './service';
import Counter from './counter/counter';




interface Props  {
 
}

interface State {
  allVoccabulary : Vocabulary[]
  success: number;
  fail: number;
}


export default class App extends React.PureComponent<Props, State> {
  componentWillMount() {
    Service.get('https://storage.gra.cloud.ovh.net/v1/AUTH_3a41d7684b854e98b76a6a8b52ec32fd/weather/vocabulary.json').subscribe({
      next: (allVoccabulary: Vocabulary[]) => {
        this.setState({allVoccabulary});
      }
    })
  }

  countSuccess() {
    this.setState({success: (this.state.success || 0) + 1});
  }

  countFail() {
    this.setState({fail: (this.state.fail || 0) + 1});
  }

  render(): JSX.Element | null {
    const allVoccabulary = (this.state || {}).allVoccabulary || [];
    const fail = (this.state || {}).fail || 0;
    const success = (this.state || {}).success || 0;

    return (
      <div className="App">
        <Counter fail={fail} success={success}/>
        <Game count={6} allVoccabulary={allVoccabulary} countFail={this.countFail.bind(this)} countSuccess={this.countSuccess.bind(this)}/>
      </div>
    );
  }
}