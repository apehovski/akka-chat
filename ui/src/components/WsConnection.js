import React, {Component} from 'react';
import {connect} from 'react-redux';
import {wsReceivedMessage} from "../actions/roomActions";
import {config} from "../utils/utils";


const mapStateToProps = store => {
  return {
    userProfile: store.authReducer.userProfile
  }
}

class WsConnection extends Component {

  constructor(props) {
    super(props);
    const wsSocket = new WebSocket(config.WS_API)
    wsSocket.onopen = event => {
      console.log('WS connected ' + JSON.stringify(event))
    }
    wsSocket.onmessage = event => {
      const message = JSON.parse(event.data)
      this.props.dispatch(wsReceivedMessage(message))
    }

    this.state = {
      wsSocket,
      wsLoggedIn: false
    }
  }

  componentDidMount() {
    this.setState({
      wsLoggedIn: false,
      ...this.props.state
    })

    this.createWsConnectionWithWaiting()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.createWsConnectionWithWaiting()
  }

  waitForConnection(wsSocket, callback) {
    if (wsSocket.readyState === 1) {
      callback();
    } else {
      const that = this;
      setTimeout(() => {
        that.waitForConnection(wsSocket, callback);
      }, 100);
    }
  }

  createWsConnectionWithWaiting() {
    this.waitForConnection(this.state.wsSocket, () => {
      this.createWsConnection();
    })
  }

  createWsConnection() {
    const wsSocket = this.state.wsSocket
    const username = this.props.userProfile.username

    if (!this.state.wsLoggedIn) {
      wsSocket.send(JSON.stringify({
        username
      }))

      this.setState({
        wsSocket,
        wsLoggedIn: true
      })
    }
  }

  render() {
    return (
      <div />
    )
  }
}

WsConnection = connect(mapStateToProps)(WsConnection)

export default WsConnection;