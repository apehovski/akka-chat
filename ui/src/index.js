import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {BrowserRouter} from 'react-router-dom';

import ChatApp from './ChatApp';
import chatApp from './reducers/reducers.js';
import rootSaga from './sagas/sagas.js';
import {reloadUser} from "./actions/actions";


const sagaMiddleware = createSagaMiddleware();

const store = createStore(chatApp, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

store.dispatch(reloadUser());

render(
    <Provider store={store}>
        <BrowserRouter>
            <ChatApp />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);