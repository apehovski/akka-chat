import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

export default () => (
  <ListGroup defaultActiveKey="/home">
    <ListGroupItem active action variant="info" href="/home">
        #general
    </ListGroupItem>
    <ListGroupItem action variant="info" href="/another">
        #team
    </ListGroupItem>
    <ListGroupItem action variant="info" href="/third">
        #offtopic
    </ListGroupItem>
  </ListGroup>
);

