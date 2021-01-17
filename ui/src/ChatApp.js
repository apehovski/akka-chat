import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from "react-router-dom";
import Container from 'react-bootstrap/Container';

import * as auth from "./utils/authLocalStorage";

import LoginForm from './containers/LoginForm';
import ProtectedRoute from "./components/ProtectedRoute";
import BaseView from "./containers/BaseView";
import NotFoundView from "./containers/NotFoundView";

const mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};

class ChatApp extends Component {
  render() {
    return (
      <Container>
        <Switch>
          <Route exact path="/"
                 render={() => {
                   return (
                     auth.isLoggedIn() ?
                       <Redirect to="/chat" /> :
                       <Redirect to="/login" />
                   )
                 }}
          />

          <ProtectedRoute exact path='/chat' component={BaseView} auth={auth.isLoggedIn()} />
          <Route exact path="/login" component={LoginForm} />
          <Route path="/404" component={NotFoundView} />
          <Redirect to="/404" />
        </Switch>
      </Container>
    );
  }
}
ChatApp = connect(mapStateToProps)(ChatApp)

export default ChatApp;