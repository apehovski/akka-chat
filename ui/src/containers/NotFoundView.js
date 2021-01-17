import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

import styled from "styled-components";

const StyledWrap = styled.div`
  p {
    text-align: center;
  }
`

export default () => {
  let history = useHistory();
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count === 0) {
      history.push("/")
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <StyledWrap>
      <p>
        <span>Page does not exist. </span>
        <Link to="/">Go to Home</Link>
      </p>
      <p>
        <span>Or wait for redirect {count} seconds...</span>
      </p>
    </StyledWrap>
  )
}
