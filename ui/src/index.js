import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';

import ChatApp from './ChatApp';
import {loadToDoList} from './actions/actions';
import chatApp from './reducers/reducers.js';
import rootSaga from './sagas/sagas.js';
import {BrowserRouter} from 'react-router-dom';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(chatApp, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

store.dispatch(loadToDoList());

render(
    // Provider can be removed with useStore, etc. hooks?
    // BrowserRouter can be removed is useHistory used?
    <Provider store={store}>
        <BrowserRouter>
            <ChatApp />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);