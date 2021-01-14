import React from 'react';
import styled from "styled-components";
import Circle from "./Circle";

const RootWrapper = styled.div`
  width: 550px;
  border: 1px solid black;
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
      <Circle color={color} />
      <TextPart>
        <UsernameArea>{username}</UsernameArea>
        <TimeArea>{time}</TimeArea>
        <MessageTextArea>{text}</MessageTextArea>
      </TextPart>
    </RootWrapper>
  );
};

export default RoomMessage;