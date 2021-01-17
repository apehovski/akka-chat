import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import LoginForm from './components/LoginForm';
import ProtectedRoute from "./components/ProtectedRoute";
import * as utils from "./utils/utils";
import BaseView from "./containers/BaseView";
import * as auth from "./utils/authLocalStorage";

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

          <ProtectedRoute path='/chat' component={BaseView} auth={auth.isLoggedIn()} />
          <Route exact path="/login" component={LoginForm} />
        </Switch>
      </Container>
    );
  }
}
ChatApp = connect(mapStateToProps)(ChatApp)

export default ChatApp;