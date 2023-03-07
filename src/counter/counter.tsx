import React from 'react';
import './counter.scss';


interface Props  {
    fail: number;
    success: number;
}

interface State {
}


export default class Counter extends React.PureComponent<Props, State> {
    render(): JSX.Element | null {
        return (
            <div className="row counter">
                <div className="col-6 success-count">
                    <span>Success:</span>
                    <span>{this.props.success}</span>
                </div>
                <div className="col-6 fail-count">
                    <span>Fail:</span>
                    <span>{this.props.fail}</span>
                </div>
            </div>
        );
    }
}