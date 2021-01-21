import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {BrowserRouter} from 'react-router-dom';

import ChatApp from './ChatApp';
import rootReducer from './reducers/reducers.js';
import rootSaga from './sagas/sagas.js';
import {LOGOUT_RESP, reloadUser} from "./actions/authActions";
import * as auth from "./utils/authLocalStorage";


const sagaMiddleware = createSagaMiddleware({
  onError: () => {
    //hook for unavailable server
    auth.logOut();
    store.dispatch({ type: LOGOUT_RESP })
  }
})

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
store.subscribe(() => {
  // console.log(store.getState());
});

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