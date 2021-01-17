import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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