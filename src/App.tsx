import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Game from './game/game';
import { Service, Vocabulary } from './service';
import Counter from './counter/counter';
import Progress from './progress/progress';
import { Multiselect } from 'multiselect-react-dropdown';


interface Content {
  name: string;
  id: number;
}


interface Props  {
 
}

interface State {
  allVoccabulary : Vocabulary[]
  byTheme: {[key: string]: Vocabulary[]}
  success: number;
  fail: number;
  listOfSections: Content[];

  toLoad: number;
  loaded: number;
  barMuted: boolean;
}


export default class App extends React.PureComponent<Props, State> {
  componentWillMount() {
    let allVoccabulary : Vocabulary[] = [];
    let byTheme: {[key: string]: Vocabulary[]} = {};
    let listOfSections: Content[] = [];
    let counter = 0;

    Service.gidList().subscribe({
      next: (idx: {(name: string): string}) => {
        this.setState({toLoad: Object.keys(idx).length});

        Service.getAll(idx).subscribe({
          next: (voc: {(name: string):Vocabulary[]})=> {
            console.log('voc', voc);
            Object.keys(voc).forEach((name: string) => {
              const v = (voc as any)[name] || {};
              allVoccabulary = [...allVoccabulary, ...v]
              byTheme[name] = v;
              console.log(name);
              listOfSections = [...listOfSections, {name: `${name}`, id:listOfSections.length}];
            })
            byTheme = {...byTheme, }
            counter++;

            if (counter === Object.keys(idx).length) {
              this.setState({allVoccabulary, byTheme, loaded: counter, listOfSections});
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

  onSelect(selectedList: Content[], selectedItem: string) {
    console.log(selectedList);
    const allVoccabulary = selectedList.reduce((all: Vocabulary[], section: Content) => {
      return [...all, ...this.state.byTheme[section.name]];
    }, []);
    this.setState({allVoccabulary});
  }

  render(): JSX.Element | null {
    const allVoccabulary = (this.state || {}).allVoccabulary || [];
    const fail = (this.state || {}).fail || 0;
    const success = (this.state || {}).success || 0;
    const toLoad = (this.state || {}).toLoad || 0;
    const loaded = (this.state || {}).loaded || 0;
    const barMuted = (this.state || {}).barMuted;
    const listOfSections = (this.state || {}).listOfSections || [];

    return (
      <div className="App">
        {barMuted && <div className='row'>
          <div className='col-12'>
            <span>{allVoccabulary.length} words</span>
            <Multiselect
              showArrow
              displayValue="name"
              options={listOfSections}
              isObject={true}
              selectedValues={listOfSections}
              onSelect={this.onSelect.bind(this)}
              onRemove={this.onSelect.bind(this)}
            />
          </div>
        </div>}
        {!barMuted && <div className='row'>
          <div className='col-12'>
            <Progress completed={loaded} total={toLoad}/>
          </div>
        </div>}
        <Counter fail={fail} success={success}/>
        <Game count={6} trigger={2} allVoccabulary={allVoccabulary} countFail={this.countFail.bind(this)} countSuccess={this.countSuccess.bind(this)}/>
      </div>
    );
  }
}