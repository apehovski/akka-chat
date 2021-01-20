import React, {useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import styled from "styled-components";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import {FormControl} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {sendMessage} from "../../actions/roomActions";

const RootWrapper = styled.div`
  @media (min-width: 1024px) {
    width: 700px;    
  }
  @media (max-width: 1024px) {
    width: 480px;    
  }
  
  position: fixed;
  bottom: 0;
  padding-bottom: 30px;
  
  input.form-control {
    box-shadow: none;
  }
`

let RoomInput = ({ className }) => {
  const dispatch = useDispatch();
  const [msgText, setMsgText] = useState('');

  return (
    <RootWrapper className={className}>
      <Form
        onSubmit={e => {
          e.preventDefault();
          if (!msgText.trim()) {
            return;
          }
          dispatch(sendMessage(msgText));
          setMsgText('');
        }}
      >
      <Form.Group>
        <InputGroup>
          <FormControl
            type="text"
            placeholder="Message to #general"
            value={msgText}
            onChange={e => setMsgText(e.target.value)}
            autoFocus
            maxLength="300"
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