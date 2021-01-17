import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from "styled-components";

import RoomMessage from "./RoomMessage";
import RoomInput from "./RoomInput";
import {loadGeneralMessages} from "../../actions/actions";


const StyledWrap = styled.div`
  width: 550px;
  margin: 0 auto;
  overflow-y: scroll;
  max-height: 85vh;
  border: 1px solid #dee2e6;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`

const RoomMessageS = styled(RoomMessage)`
  margin-bottom: 10px;
`

const mapStateToProps = store => {
  return {
    messageList: store.messageList
  }
}

class RoomView extends Component {

  constructor(props) {
    super(props);
    this.props.dispatch(loadGeneralMessages());
    this.bottomDivRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const node = this.bottomDivRef.current;
    node.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return (
      <StyledWrap>
        {this.props.messageList.map((item, index) => (
          <RoomMessageS key={index} {...item} />
        ))}
        <div ref={this.bottomDivRef} />
        <RoomInput />
      </StyledWrap>
    )
  }
}

RoomView = connect(mapStateToProps)(RoomView)

export default RoomView;