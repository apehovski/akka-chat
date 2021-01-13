import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import LoginForm from './components/LoginForm';

class App extends Component {
  render() {
    return (
      <Container>
        <LoginForm/>
      </Container>
    );
  }
}
export default App;