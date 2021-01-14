import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import App from './App';
import ChatApp from './ChatApp';
import { loadToDoList } from './actions';
import chatApp from './reducers';
import rootSaga from './sagas';
import { BrowserRouter } from 'react-router-dom';
import RoomView from "./containers/RoomView";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(chatApp, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

store.dispatch(loadToDoList());

render(
    // Provider can be removed with useStore, etc. hooks?
    <Provider store={store}>
        <BrowserRouter>
            {/*<App />*/}
            {/*<ChatApp />*/}
            {/*<RoomMessage msgData={msgData}/>*/}
            <RoomView />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);