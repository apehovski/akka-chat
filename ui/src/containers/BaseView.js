import React from 'react';
import styled from "styled-components";
import LeftMenu from "../components/menu/LeftMenu";
import RoomView from "../components/room/RoomView";
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import WsConnection from "../components/WsConnection";

const ContainerStyled = styled(Container)`
  width: 80%;
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
      <WsConnection />

      <Row className="row">
        <LeftCol className="col-sm">
          <LeftMenu />
        </LeftCol>
        <RightCol className="col-sm">
          <RoomView />
        </RightCol>
      </Row>
    </ContainerStyled>
  );
};

export default BaseView;