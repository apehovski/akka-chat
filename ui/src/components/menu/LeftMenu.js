import React from "react";
import styled from 'styled-components';
import ProfileView from "./ProfileView";
import VerticalNavigation from "./VerticalNavigation";
import StatsView from "./StatsView";
import {useSelector} from "react-redux";

const MenuWrapper = styled.div`
  border: 1px solid #dee2e6;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`

export default () => {
  const stats = useSelector(store => store.statsReducer.stats);

  return (
    <MenuWrapper>
      <ProfileView/>
        <hr/>
        <VerticalNavigation/>
        <hr/>
        {stats.length > 0 && <StatsView/>}
    </MenuWrapper>
  );
}

