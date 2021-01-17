import React from "react";
import styled from 'styled-components';
import Circle from "../Circle";
import {useSelector} from "react-redux";


const StyledWrapper = styled.div`
  height: 50px;
`

const LeftArea = styled.div`
  display: inline-block;
  width: 80%;
`
const UserNameArea = styled.div`
  font-weight: 600;
  float: left;
  margin: 5px 0 10px 5px;
  user-select: none;
  max-width: 180px;
  text-overflow: ellipsis;
  overflow: hidden;
`
const LogoutLink = styled.div`
  font-size: 80%;
  clear: both;
  margin: 0 0 0 5px;
`

const RightArea = styled.div`
  display: inline-block;
  width: 20%;
  height: 100%;
  margin: 5px 0 0 0;
  vertical-align: top; //important property
`

export default () => {
  const userProfile = useSelector(store => store.userProfile);

  return (
    <StyledWrapper>
      <LeftArea>
        <UserNameArea>{userProfile.username}</UserNameArea>
        <LogoutLink>
          Logout
          {/*<Nav.Link to="/test">Home</Nav.Link>*/}
        </LogoutLink>
      </LeftArea>

      <RightArea>
        <Circle color={userProfile.color}></Circle>
      </RightArea>
    </StyledWrapper>
  );
}

