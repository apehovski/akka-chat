import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from "styled-components";
import RoomMessage from "../components/RoomMessage";
import RoomInput from "../components/RoomInput";
import {loadGeneralMessages} from "../actions";

const StyledWrap = styled.div`
  // display: inline-block;
`

const RoomMessageS = styled(RoomMessage)`
  margin-bottom: 10px;
`

const RoomView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadGeneralMessages());
  }, [dispatch]);

  const messageList = useSelector(store => store.messageList);

  return (
    <StyledWrap>
      {messageList.map((item, index) => (
        <RoomMessageS key={index} {...item} />
      ))}
      <RoomInput />
    </StyledWrap>
  );
};

export default RoomView;