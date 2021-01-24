import React from "react";
import styled from 'styled-components';
import ProfileView from "./ProfileView";
import VerticalNavigation from "./VerticalNavigation";
import StatsView from "./StatsView";

const MenuWrapper = styled.div`
  border: 1px solid #dee2e6;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`

export default () => (
  <MenuWrapper>
    <ProfileView />
    <hr />
    <VerticalNavigation />
    <hr />
    <StatsView />
  </MenuWrapper>
);

