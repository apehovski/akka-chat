import React, {useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import {Redirect} from 'react-router-dom';
import styled from "styled-components";
import * as auth from "../utils/authLocalStorage";
import {doLogin} from "../actions/authActions";

const StyledWrap = styled.div`
  margin-top: 15%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .input-group > input {
    width: 20%;
    height: 40px;
    font-size: 18px;
  }
  
  .input-group > input::placeholder {
    font-size: 16px;
    color: #C0C0C0
  }
  
  .input-group > .input-group-append > button {
    font-size: 16px;
  }
`

let LoginForm = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');

  if (auth.isLoggedIn()) {
    return (<Redirect to="/" />);
  }

  return (
    <StyledWrap>
      <div className="outerWrap">
        <Card>
          <Card.Header>Welcome to web-chat</Card.Header>
          <Card.Body>
            <Form
              onSubmit={e => {
                e.preventDefault();
                dispatch(doLogin(username));
              }}
            >
              <Form.Group>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    maxLength="30"
                  />
                  <InputGroup.Append>
                    <Button type="submit" variant="info">Login</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </StyledWrap>
  );
};
LoginForm = connect()(LoginForm);

export default LoginForm;