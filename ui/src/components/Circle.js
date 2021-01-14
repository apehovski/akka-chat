import React from 'react';
import styled from "styled-components";

const CircleWrapper = styled.div`
  padding: 5px 0 0 5px;
  width: 55px;
  float: left;
  border: 1px solid black;
`

const CircleView = styled.div`
  height: 40px;
  width: 40px;
  background-color: ${props =>
    props.circleColor || '#bbb'
  };
  border-radius: 50%;
  display: inline-block;
`

let Circle = ({ color }) => {
  return (
      <CircleWrapper>
        <CircleView circleColor={color} />
      </CircleWrapper>
  );
};

export default Circle;