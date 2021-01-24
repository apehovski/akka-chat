import React from "react";
import styled from 'styled-components';
import {useSelector} from "react-redux";


const StyledWrapper = styled.div`
  margin: 0 0 0 5px;
`

export default () => {
  const stats = useSelector(store => store.statsReducer.stats);

  return (
    <StyledWrapper>
      <h6>Top {stats.length} words:</h6>
      <ul>
        {stats.map((item, index) => (
          <li key={index}>
            <span>{item.word} </span>
            (<span>{item.count}</span>)
          </li>
        ))}
      </ul>
    </StyledWrapper>
  );
}

