import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from "styled-components";
import RoomMessage from "../components/RoomMessage";
import RoomInput from "../components/RoomInput";
import {loadGeneralMessages} from "../actions/actions";

const StyledWrap = styled.div`
  width: 550px;
  border: 1px solid black;
  margin: 0 auto;
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