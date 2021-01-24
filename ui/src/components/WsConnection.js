import React, {Component} from 'react';
import {connect} from 'react-redux';
import {wsNewMessage} from "../actions/roomActions";
import {config} from "../utils/utils";
import {wsFullStats, wsStatsUpdate} from "../actions/statsActions";


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
      console.log('WS connected')
    }
    wsSocket.onmessage = event => {
      const incoming = JSON.parse(event.data)
      switch (incoming.type) {
        case "chat-message":
          this.props.dispatch(wsNewMessage(incoming.msg))
          break;

        case "full-stats":
          this.props.dispatch(wsFullStats(incoming.full))
          break;

        case "stats-update":
          this.props.dispatch(wsStatsUpdate(incoming.update))
          break;

        default:
          console.warn("Unknown WS incoming: " + JSON.stringify(incoming))
      }
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

  componentWillUnmount() {
    this.state.wsSocket.close();
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