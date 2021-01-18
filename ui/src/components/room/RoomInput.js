import React, {useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import styled from "styled-components";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import {FormControl} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {sendMessage} from "../../actions/actions";

const RootWrapper = styled.div`
  width: 550px;
  position: fixed;
  bottom: 0;
  padding-bottom: 30px;
  
  input.form-control {
    box-shadow: none;
  }
`

let RoomInput = ({ className }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(store => store.authReducer.userProfile);
  const [msgText, setMsgText] = useState('');

  return (
    <RootWrapper className={className}>
      <Form
        onSubmit={e => {
          e.preventDefault();
          if (!msgText.trim()) {
            return;
          }
          dispatch(sendMessage(userProfile, msgText));
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