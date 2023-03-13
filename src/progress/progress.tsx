import React from 'react';
import './progress.scss';


interface Props  {
    completed: number;
    total: number;
}

interface State {
}


export default class Progress extends React.PureComponent<Props, State> {
    
    
    render(): JSX.Element | null {
        const completed = (this.props || {}).completed || 0;
        const total = (this.props || {}).total || 0;
        const percent = completed * 100 / (total || 1);

        const fillerStyles = {
            width: `${percent}%`,
        };
        
        return (<div className='progress'>
            <div style={fillerStyles} className='bar'>
                <span className='label' ></span>
            </div>
        </div>);
    }
}