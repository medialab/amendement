/**
 * Amendements Main Entry
 * =======================
 *
 */
import React from 'react';
import Application from './components/application.jsx';
import {root} from 'baobab-react/higher-order';
import tree from './state.js';
import client from './client.js';

// Style
require('../css/codemirror.css');
require('../css/codemirror.theme.css');
require('../css/app.css');

const mount = document.getElementById('mount'),
      RootElement = root(Application, tree);

React.render(<RootElement />, mount);

export default tree;
