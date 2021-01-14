import React from 'react';
import {connect} from 'react-redux';
import styled from "styled-components";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import {FormControl} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const RootWrapper = styled.div`
  width: 550px;
  // border: 1px solid black;
  
  input.form-control {
    box-shadow: none;
  }
`

let RoomInput = ({ dispatch, className }) => {
  let input;

  return (
    <RootWrapper className={className}>
      <Form
        onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          dispatch(RoomInput(input.value));
          input.value = '';
        }}
      >
      <Form.Group>
        <InputGroup>
          <FormControl
            type="text"
            placeholder="Message to #general"
            ref={node => {
              input = node;
            }}
          />
          <InputGroup.Append>
            <Button type="submit" variant="secondary">Send</Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
      </Form>
    </RootWrapper>
  );
};
RoomInput = connect()(RoomInput);

export default RoomInput;