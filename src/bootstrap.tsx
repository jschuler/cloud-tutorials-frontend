import React from 'react';
import ReactDOM from 'react-dom';
import AppEntry from './AppEntry';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.render(<AppEntry />, root, () => root.setAttribute('data-ouia-safe', 'true'));
