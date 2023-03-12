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
    let allVoccabulary : Vocabulary[] = [];
    let counter = 0;

    Service.gidList().subscribe({
      next: (idx: string[]) => {
        console.log(idx);
        Service.getAll(idx).subscribe({
          next: (voc: Vocabulary[])=> {
            allVoccabulary = [...allVoccabulary, ...voc]
            counter++;

            if (counter === idx.length-1) {
              this.setState({allVoccabulary});
            }
          }
        })
      }
    });

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
        <span>{allVoccabulary.length} words</span>
        {allVoccabulary.length===0 && <span> - loading ...</span>}
        <Counter fail={fail} success={success}/>
        <Game count={6} allVoccabulary={allVoccabulary} countFail={this.countFail.bind(this)} countSuccess={this.countSuccess.bind(this)}/>
      </div>
    );
  }
}