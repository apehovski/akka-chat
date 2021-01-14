import React from 'react';
import {connect} from 'react-redux';
import styled from "styled-components";

const RootWrapper = styled.div`
  width: 550px;
  // border: 1px solid black;
`

const CircleWrapper = styled.div`
  padding: 5px 0px 0px 5px;
  width: 55px;
  float: left;
  // border: 1px solid black;
`

const Circle = styled.div`
  height: 40px;
  width: 40px;
  background-color: ${props =>
    props.circleColor || '#bbb'
  };  
  border-radius: 50%;
  display: inline-block;
`
const TextPart = styled.div`
  display: inline-block;
`

const UsernameArea = styled.div`
  float: left;
  font-weight: 600;
  margin-right: 5px;
  font-size: 100%;
  // border: 1px solid black;
`

const TimeArea = styled.div`
  float: left;
  color: #bbb;
  font-weight: 200;
  font-size: 80%;
  margin-top: 3px; 
  // border: 1px solid black;
`

const MessageTextArea = styled.div`
  clear:both;
  max-width: 490px;
  font-size: 90%;
  // border: 1px solid blue;
`


let RoomMessage = ({ className, color, username, time, text }) => {

  return (
    <RootWrapper className={className}>
      <CircleWrapper>
        <Circle circleColor={color} />
      </CircleWrapper>
      <TextPart>
        <UsernameArea>{username}</UsernameArea>
        <TimeArea>{time}</TimeArea>
        <MessageTextArea>{text}</MessageTextArea>
      </TextPart>
    </RootWrapper>
  );
};
RoomMessage = connect()(RoomMessage);

export default RoomMessage;