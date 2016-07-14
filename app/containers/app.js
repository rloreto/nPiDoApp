import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import api from '../middleware/api';

import * as reducers from '../reducers';
import NPiDoApp from './nPiDoApp';

const createStoreWithMiddleware = applyMiddleware(thunk, api)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NPiDoApp />
      </Provider>
    );
  }
}


export default App;
