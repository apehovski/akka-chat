import React from 'react';
import styled from "styled-components";
import LeftMenu from "../components/menu/LeftMenu";
import RoomView from "../components/room/RoomView";
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import WsConnection from "../components/WsConnection";
import {isMockDev} from "../utils/utils";

const ContainerStyled = styled(Container)`
`

const LeftCol = styled(Col)`
  min-height: 100%;
  height: 100%;
`
const RightCol = styled(Col)`
  min-height: 100%;
  height: 100%;
`

const BaseView = () => {
  return (
    <ContainerStyled>
      { !isMockDev() && <WsConnection/> }

      <Row>
        <LeftCol xs={6} md={4}>
          <LeftMenu />
        </LeftCol>
        <RightCol xs={12} md={8}>
          <RoomView />
        </RightCol>
      </Row>
    </ContainerStyled>
  );
};

export default BaseView;