import React from "react";
import styled from 'styled-components';
import Circle from "../Circle";


const StyledWrapper = styled.div`
  height: 80px;
  // background: #ABDDE5;
  border: 1px solid black;
`

const LeftArea = styled.div`
  display: inline-block;
  width: 80%;
  height: 100%;
  border: 1px solid blue;
`
const UserNameArea = styled.div`
  font-weight: 600;
  float: left;
  border: 1px solid black;
`
const LogoutLink = styled.div`
  font-size: 80%;
  clear: both;
  border: 1px solid black;
`

const RightArea = styled.div`
  display: inline-block;
  width: 20%;
  height: 100%;
  border: 1px solid red;
  vertical-align: top; //important
`

export default () => (
  <StyledWrapper>
    <LeftArea>
      <UserNameArea>First User</UserNameArea>
      <LogoutLink>
        Logout
        {/*<Nav.Link to="/test">Home</Nav.Link>*/}
      </LogoutLink>
    </LeftArea>

    <RightArea>
      <Circle color="black"></Circle>
    </RightArea>
  </StyledWrapper>
);

