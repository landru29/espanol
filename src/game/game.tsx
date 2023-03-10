import React from 'react';
import './game.scss';
import { Service, Vocabulary } from '../service';




interface Props  {
    count: number;
    allVoccabulary: Vocabulary[];
    countFail: () => void;
    countSuccess: () => void;
    trigger?: number;
}

interface State {
  working: Vocabulary[]
  quiz: string[];
  firstSelected: number | undefined;
  secondSelected: number | undefined;
  firstSuccess: boolean[];
  secondSuccess: boolean[];
  firstFail: boolean[];
  secondFail: boolean[];
}


export default class Game extends React.PureComponent<Props, State> {
    componentDidUpdate() {
        this.checkToRegen();
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

    checkToRegen() {
        const trigger = this.props.trigger || this.props.count/2;
        const notDone = ((this.state || {}).firstSuccess || []).filter((elt) => !elt).length;
        const total = ((this.state || {}).working || []).length
        if (total === 0 || notDone < (this.props.count - trigger)) {
            this.generate();
        }
    }

    check() {
        const firstSuccess = [...(this.state || {}).firstSuccess];
        const secondSuccess = [...(this.state || {}).secondSuccess];
        const firstFail = [...(this.state || {}).firstFail];
        const secondFail = [...(this.state || {}).secondFail];

        const firstSelected = this.state.firstSelected;
        const secondSelected = this.state.secondSelected;

        if (firstSelected === undefined || secondSelected === undefined) {
        return
        }

        const correct = this.state.working[firstSelected].es === this.state.quiz[secondSelected];
        if (correct) {

            firstSuccess[firstSelected] = true;
            secondSuccess[secondSelected] = true;

            this.props.countSuccess();

            this.setState({firstSelected: undefined, secondSelected: undefined, firstSuccess, secondSuccess}, () => {
                window.setTimeout(() => {
                this.checkToRegen();
                }, 500);
            });

            return
        }

        firstFail[firstSelected] = true;
        secondFail[secondSelected] = true;

        this.props.countFail();

        this.setState({firstSelected: undefined, secondSelected: undefined, firstFail, secondFail}, () => {
            window.setTimeout(() => {
                const firstFail = [...(this.state || {}).firstFail];
                const secondFail = [...(this.state || {}).secondFail];

                firstFail[firstSelected] = false;
                secondFail[secondSelected] = false;

                this.setState({firstFail, secondFail});
            }, 1000);
        });
    }

    sort(count: number): Vocabulary[] {
        const working: Vocabulary[] = [];
        const alreadyTaken: number[] = [];
        for (let i=0; i<count; i++) {
            let idx = 0
            do {
                idx = Math.round(Math.random() * this.props.allVoccabulary.length);
            } while (alreadyTaken.includes(idx));
            alreadyTaken.push(idx);
            working.push(this.props.allVoccabulary[idx]);
        }

        return working;
    }

    answers(voc: Vocabulary[]): string[] {
        return voc.map((elt: Vocabulary) => {
            return elt.es
        }).sort((a, b) => 0.5 - Math.random());
    }

    generate() {
        if (this.props.allVoccabulary.length == 0) {
            return;
        }

        const currentWorking = (this.state || {}).working || [];
        const currentQuiz = (this.state || {}).quiz || [];
        const currentFirstSuccess = (this.state || {}).firstSuccess || [];
        const currentSecondSuccess = (this.state || {}).secondSuccess || [];

        currentFirstSuccess.forEach((val: boolean, idx: number) => {
            if (val && currentWorking.length>idx) {
                currentWorking[idx] = {fr:'', es:''};
            }
        });

        const bucketWords = this.sort(this.props.count);
        
        let idx = 0;
        const newWords: Vocabulary[] = [];
        const working = Array.from(Array(this.props.count).keys()).map((key: number)=> {
            // array must be enlarged.
            if (currentWorking.length < key) {
                const out = bucketWords[idx];
                idx++;
                newWords.push(out);
                return out;
            }

            // there is a hole !
            if (!currentWorking[key] || currentWorking[key].fr==='') {
                const out = bucketWords[idx];
                idx++;
                newWords.push(out);
                return out;
            }

            return currentWorking[key];
        });

        const answers = this.answers(newWords);
        idx = 0;
        Array.from(Array(this.props.count).keys()).forEach((key: number) => {
            if (currentSecondSuccess.length>idx && currentSecondSuccess[key]) {
                currentQuiz[key] = answers[idx];
                idx++;
            }
            if (currentSecondSuccess.length<=idx) {
                currentQuiz[key] = answers[idx];
                idx++;
            }
        })
        const quiz = [...currentQuiz];

        const firstSuccess = working.map((elt: Vocabulary) => false);
        const secondSuccess = working.map((elt: Vocabulary) => false);
        const firstFail = working.map((elt: Vocabulary) => false);
        const secondFail = working.map((elt: Vocabulary) => false);

        this.setState({working, quiz, firstSuccess, secondSuccess, firstFail, secondFail});
    }

    render(): JSX.Element | null {
        const working = (this.state || {}).working || [];
        const quiz = (this.state || {}).quiz || [];
        const firstSelected = (this.state || {}).firstSelected;
        const secondSelected = (this.state || {}).secondSelected;
        const firstSuccess = (this.state || {}).firstSuccess;
        const secondSuccess = (this.state || {}).secondSuccess;
        const firstFail = (this.state || {}).firstFail;
        const secondFail = (this.state || {}).secondFail;

        return (
            <div className="row">
            <div className="col-6">
                {working.map((elt: Vocabulary, idx: number) => {
                return <div className={`entry ${firstSelected===idx?'selected':''} ${firstSuccess[idx]?'success':''} ${firstFail[idx]?'fail':''}`} key={idx}>
                    <button className="btn btn-primary" onClick={this.toggleFirst(idx).bind(this)} disabled={firstSuccess[idx]}>{elt.fr}</button>
                </div>
                })}
            </div>
            <div className="col-6">
                {quiz.map((elt: string, idx: number) => {
                return <div className={`entry ${secondSelected===idx?'selected':''} ${secondSuccess[idx]?'success':''} ${secondFail[idx]?'fail':''}`} key={idx}>
                    <button className="btn btn-secondary" onClick={this.toggleSecond(idx).bind(this)} disabled={secondSuccess[idx]}>{elt}</button>
                </div>
                })}
            </div>
            </div>
        );
    }
}