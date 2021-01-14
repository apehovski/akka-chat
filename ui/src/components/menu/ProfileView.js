import React from "react";
import styled from 'styled-components';
import Circle from "../Circle";


const StyledWrapper = styled.div`
  height: 50px;
  // border: 1px solid black;
`

const LeftArea = styled.div`
  display: inline-block;
  width: 80%;
  // border: 1px solid blue;
`
const UserNameArea = styled.div`
  font-weight: 600;
  float: left;
  margin: 5px 0 10px 5px;
  user-select: none;
  // border: 1px solid black;
`
const LogoutLink = styled.div`
  font-size: 80%;
  clear: both;
  margin: 0 0 0 5px;
  // border: 1px solid black;
`

const RightArea = styled.div`
  display: inline-block;
  width: 20%;
  height: 100%;
  margin: 5px 0 0 0;
  vertical-align: top; //important property
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

