import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Service, Vocabulary } from './service';




interface Props  {
}

interface State {
  allVoccabulary : Vocabulary[]
  working: Vocabulary[]
  quiz: string[];
  firstSelected: number | undefined;
  secondSelected: number | undefined;
  firstSuccess: boolean[];
  secondSuccess: boolean[];
}


export default class App extends React.PureComponent<Props, State> {
  componentWillMount() {
    Service.get().subscribe({
      next: (allVoccabulary: Vocabulary[]) => {
        this.setState({allVoccabulary}, () => this.generate());
      }
    })
  }

  toggleFirst(idx: number) {
    return () => {
      if (this.state.secondSelected != undefined) {
        // Check
        this.setState({firstSelected: idx}, ()=>this.check());
        return;
      }

      if (this.state.firstSelected === idx) {
        this.setState({firstSelected: undefined});
        return;
      }

      this.setState({firstSelected: idx});
    }
  }

  toggleSecond(idx: number) {
    return () => {
      if (this.state.firstSelected != undefined) {
        // Check
        this.setState({secondSelected: idx}, ()=>this.check());
        return;
      }

      if (this.state.secondSelected === idx) {
        this.setState({secondSelected: undefined});
        return
      }

      this.setState({secondSelected: idx});
    }
  }

  check() {
    const firstSuccess = [...(this.state || {}).firstSuccess];
    const secondSuccess = [...(this.state || {}).secondSuccess];



    if (this.state.firstSelected !== undefined && this.state.secondSelected !== undefined) {
      const state = this.state.working[this.state.firstSelected].es === this.state.quiz[this.state.secondSelected];

      firstSuccess[this.state.firstSelected] = state;
      secondSuccess[this.state.secondSelected] = state;
    }

    this.setState({firstSelected: undefined, secondSelected: undefined, firstSuccess, secondSuccess});
  }

  generate() {
    const working: Vocabulary[] = [];
    for (let i=0; i<5; i++) {
      const idx = Math.floor(Math.random() * this.state.allVoccabulary.length);
      working.push(this.state.allVoccabulary[idx]);
    }

    const quiz = working.map((elt: Vocabulary) => {
      return elt.es
    }).sort((a, b) => 0.5 - Math.random());

    const firstSuccess = working.map((elt: Vocabulary) => false);
    const secondSuccess = working.map((elt: Vocabulary) => false);

    this.setState({working, quiz, firstSuccess, secondSuccess});
  }

  render(): JSX.Element | null {
    const working = (this.state || {}).working || [];
    const quiz = (this.state || {}).quiz || [];
    const firstSelected = (this.state || {}).firstSelected;
    const secondSelected = (this.state || {}).secondSelected;
    const firstSuccess = (this.state || {}).firstSuccess;
    const secondSuccess = (this.state || {}).secondSuccess;

    return (
      <div className="App">
        <div className="row">
          <div className="col-6">
            {working.map((elt: Vocabulary, idx: number) => {
              return <div className={`entry ${firstSelected===idx?'selected':''} ${firstSuccess[idx]?'success':''}`} key={idx}><button className="btn btn-primary" onClick={this.toggleFirst(idx).bind(this)}>{elt.fr}</button></div>
            })}
          </div>
          <div className="col-6">
            {quiz.map((elt: string, idx: number) => {
              return <div className={`entry ${secondSelected===idx?'selected':''} ${secondSuccess[idx]?'success':''}`} key={idx}><button className="btn btn-secondary" onClick={this.toggleSecond(idx).bind(this)}>{elt}</button></div>
            })}
          </div>
        </div>
      </div>
    );
  }
}