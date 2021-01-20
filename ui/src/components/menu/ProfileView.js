import React from "react";
import styled from 'styled-components';
import Circle from "../Circle";
import {useDispatch, useSelector} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import * as auth from "../../utils/authLocalStorage";
import {doLogout} from "../../actions/authActions";


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
  text-overflow: ellipsis;
  overflow: hidden;
`
const LogoutArea = styled.div`
  font-size: 80%;
  clear: both;
  margin: 0 0 0 5px;
  a {
    color: #483D8B;
    text-decoration: none;
  }
`

const RightArea = styled.div`
  display: inline-block;
  width: 20%;
  height: 100%;
  margin: 5px 0 0 0;
  vertical-align: top; //important property
`

export default () => {
  let dispatch = useDispatch();
  const userProfile = useSelector(store => store.authReducer.userProfile);

  if (!auth.isLoggedIn()) {
    return (<Redirect to="/" />);
  }

  return (
    <StyledWrapper>
      <LeftArea>
        <UserNameArea>{userProfile.username}</UserNameArea>
        <LogoutArea>
          <Link to="/" onClick={e => {
              e.preventDefault();
              dispatch(doLogout());
            }}>
            Logout
          </Link>
        </LogoutArea>
      </LeftArea>

      <RightArea>
        <Circle color={userProfile.color}></Circle>
      </RightArea>
    </StyledWrapper>
  );
}

