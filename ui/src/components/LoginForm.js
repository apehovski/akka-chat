import React from 'react';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import {useHistory} from 'react-router-dom';
import styled from "styled-components";

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
    border: 1px solid black;
  }
  
  .input-group > input::placeholder {
    font-size: 16px;
    color: #C0C0C0
  }
  
  .input-group > .input-group-append > button {
    font-size: 16px;
    border: 1px solid black;
  }
`

let LoginForm = ({ dispatch }) => {
  let input;

  let history = useHistory()

  return (
    <StyledWrap>
      <div className="outerWrap">
        <Card>
          <Card.Header>Welcome to web-chat</Card.Header>
          <Card.Body>
            <Form
              onSubmit={e => {
                e.preventDefault();
                if (!input.value.trim()) {
                  return;
                }
                dispatch(LoginForm(input.value));
                input.value = '';
                history.push("/")
              }}
            >
              <Form.Group>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    ref={node => {
                      input = node;
                    }}
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