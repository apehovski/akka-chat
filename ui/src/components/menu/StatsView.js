import React from "react";
import styled from 'styled-components';
import {useSelector} from "react-redux";


const StyledWrapper = styled.div`
  // border: 1px solid black;
  //TODO word-wrap
`

export default () => {
  const stats = useSelector(store => store.statsReducer.stats);

  return (
    <StyledWrapper>
      <p>Top {stats.length} words:</p>
      {stats.map((item, index) => (
        <div key={index}>
          <span>{item.word}</span> - <span>{item.count}</span>
        </div>
      ))}
    </StyledWrapper>
  );
}

