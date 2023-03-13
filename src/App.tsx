import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Game from './game/game';
import { Service, Vocabulary } from './service';
import Counter from './counter/counter';
import Progress from './progress/progress';




interface Props  {
 
}

interface State {
  allVoccabulary : Vocabulary[]
  byTheme: {[key: string]: Vocabulary}
  success: number;
  fail: number;

  toLoad: number;
  loaded: number;
  barMuted: boolean;
}


export default class App extends React.PureComponent<Props, State> {
  componentWillMount() {
    let allVoccabulary : Vocabulary[] = [];
    let byTheme: {[key: string]: Vocabulary} = {};
    let counter = 0;

    Service.gidList().subscribe({
      next: (idx: {(name: string): string}) => {
        console.log(idx);

        this.setState({toLoad: Object.keys(idx).length});

        Service.getAll(idx).subscribe({
          next: (voc: {(name: string):Vocabulary[]})=> {
            Object.keys(voc).forEach((name: string) => {
              const v = (voc as any)[name] || {};
              allVoccabulary = [...allVoccabulary, ...v]
              byTheme[name] = v;
            })
            byTheme = {...byTheme, }
            counter++;

            if (counter === Object.keys(idx).length) {
              this.setState({allVoccabulary, byTheme, loaded: counter});
              setTimeout(()=> {
                this.setState({barMuted: true});
              }, 1000);
            } else {
              this.setState({loaded: counter});
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
    const toLoad = (this.state || {}).toLoad || 0;
    const loaded = (this.state || {}).loaded || 0;
    const barMuted = (this.state || {}).barMuted;

    return (
      <div className="App">
        {barMuted && <div className='row'>
          <div className='col-12'>
            <span>{allVoccabulary.length} words</span>
          </div>
        </div>}
        {!barMuted && <div className='row'>
          <div className='col-12'>
            <Progress completed={loaded} total={toLoad}/>
          </div>
        </div>}
        <Counter fail={fail} success={success}/>
        <Game count={6} allVoccabulary={allVoccabulary} countFail={this.countFail.bind(this)} countSuccess={this.countSuccess.bind(this)}/>
      </div>
    );
  }
}