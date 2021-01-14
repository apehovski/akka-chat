import React from 'react';
import styled from "styled-components";
import LeftMenu from "../components/menu/LeftMenu";
import RoomView from "./RoomView";

const StyledWrap = styled.div`
  // width: 550px;
  border: 1px solid black;
  // margin: 0 auto;
`

const BaseView = () => {
  return (
    <StyledWrap>
      <LeftMenu />
      <RoomView />
    </StyledWrap>
  );
};

export default BaseView;