import React from "react";
import styled from 'styled-components';
import ProfileView from "./ProfileView";
import VerticalNavigation from "./VerticalNavigation";

const MenuWrapper = styled.div`
  width: 250px;
  border: 1px solid black;
`

export default () => (
  <MenuWrapper>
    <ProfileView />
    <hr />
    <VerticalNavigation />
  </MenuWrapper>
);

