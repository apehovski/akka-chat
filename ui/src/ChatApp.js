import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import LoginForm from './components/LoginForm';
import RoomView from "./containers/RoomView";
import ProtectedRoute from "./components/ProtectedRoute";

const mapStateToProps = state => {
  console.log('ChatApp state: ' + JSON.stringify(state));
  return {
    userProfile: state.userProfile
  };
};

class ChatApp extends Component {
  render() {
    const isLoggedIn = this.props.userProfile.isLoggedIn;

    return (
      <Container>
        <Switch>
          <Route exact path="/"
                 render={() => {
                   console.log('ChatApp. ' +
                     'isLoggedIn: ' + isLoggedIn
                   );

                   return (
                     this.props.userProfile.isLoggedIn ?
                       <Redirect to="/chat" /> :
                       <Redirect to="/login" />
                   )
                 }}
          />

          <ProtectedRoute path='/chat' component={RoomView} auth={isLoggedIn} />
          <Route exact path="/login" component={LoginForm} />
        </Switch>
      </Container>
    );
  }
}
ChatApp = connect(mapStateToProps)(ChatApp)

export default ChatApp;