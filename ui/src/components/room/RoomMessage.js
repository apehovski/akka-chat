import React from 'react';
import styled from "styled-components";
import Circle from "../Circle";

const RootWrapper = styled.div`
`

const TextPart = styled.div`
  display: inline-block;
`

const UsernameArea = styled.div`
  float: left;
  font-weight: 600;
  margin-right: 5px;
  font-size: 100%;
`

const TimeArea = styled.div`
  float: left;
  color: #bbb;
  font-weight: 200;
  font-size: 80%;
  margin-top: 3px; 
`

const MessageTextArea = styled.div`
  clear:both;
  font-size: 90%;
  word-wrap: break-word;
  @media (min-width: 1024px) {
    width: 650px;
  }
  @media (max-width: 1024px) {
    width: 400px;
  }
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