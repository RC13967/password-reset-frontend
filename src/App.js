import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, createContext, useContext } from "react";
import React from "react";
import { useParams } from "react-router";
import { Route, Switch, useHistory, Link } from "react-router-dom";
import { Button, Col, Container, Form, Row, Navbar, Nav, Spinner } from 'react-bootstrap';
const userContext = createContext(null);
function App() {
  const [randomString, setRandomString] = useState('');
  const [email, setEmail] = useState('');
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Reset Password App</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="nav-links">
              <Link to="/Forgot" className="nav-link">Forgot password</Link>
              <Link to="/Login" className="nav-link">Login</Link>
              <Link to="/SignUp" className="nav-link">Sign up</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <userContext.Provider value={{
        randomString: randomString, setRandomString: setRandomString,
        email: email, setEmail: setEmail
      }}>
        <Routes />
      </userContext.Provider>
    </>
  );
}
function Routes() {
  return (
    <>
      <Switch>
        <Route path="/SignUp">
          <SignUp />
        </Route>
        <Route path="/Login">
          <Login />
        </Route>
        <Route path="/Forgot">
          <Forgot />
        </Route>
        <Route path="/retrieveAccount/:email/:randomString">
          <OpenedEmail />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  )
}
function Home() {
  return (
    <Container className="container">
      <div className="home-header">Welcome!</div>
      <div className="home-content">Login, signup or reset password</div>
    </Container>
  )
}
function Forgot() {
  const { email, setEmail } = useContext(userContext);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    if (email) {
      setMessage('waiting');
      sendEmail();
    } else {
      setError('please enter the email')
    }
  }
  function sendEmail() {
    fetch("https://password-reset-ranjith.herokuapp.com/users/forgot", {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message))
  };
  return (
    <Container className="container" >
      {message ? (message === 'waiting' ? <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner> : message)
        : (
          <Row>
            <Col xs='auto' sm='7' md='6' lg='4' >
              <Form onSubmit={handleSubmit} >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} />
                  <div className="error">
                    {error}
                  </div>
                </Form.Group>
                <Button variant="primary" type="submit"  >
                  Submit
                </Button><br />
              </Form>
            </Col>
          </Row>)
      }


    </Container>
  )
}
function OpenedEmail() {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password) {
      setMessage("waiting");
      updatePassword();
    } else {
      setError("please enter the password")
    }

  }
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { email, randomString } = useParams();
  const [password, setPassword] = useState('');
  function getMessage() {
    fetch(`https://password-reset-ranjith.herokuapp.com/retrieveAccount/${email}/${randomString}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message));
  }
  function updatePassword() {
    fetch(`https://password-reset-ranjith.herokuapp.com/resetPassword/${email}/${randomString}`, {
      method: "PUT",
      body: JSON.stringify({ newPassword: password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message))
  };

  useEffect(() => {
    getMessage();
    // eslint-disable-next-line
  }, []);
  return (
    <Container className="container" >
      {message ? (message === 'waiting' ? <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner> : message)
        : (
          <Row>
            <Col xs='auto' sm='7' md='6' lg='4' >
              <Form onSubmit={handleSubmit} >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter password" onChange={(event) => setPassword(event.target.value)} />
                </Form.Group>
                <div className="error">
                  {error}
                </div>
                <Button variant="primary" type="submit"  >
                  Submit
                </Button><br />
              </Form>
            </Col>
          </Row>
        )
      }
    </Container>
  )
}

function SignUp() {
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('please enter the required(*) fields');
    } else {
      setMessage("waiting")
      createAccount();
    }
  }
  function createAccount() {
    fetch("https://password-reset-ranjith.herokuapp.com/users/SignUp", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message));
  };

  return (
    <Container className="container">
      <Row>
        <Col xs='auto' sm='7' md='6' lg='4'>
          {message === "waiting" ?
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            :

            (message ? message :
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>
                    <span className="error">*</span>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>
                    <span className="error">*</span>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
                </Form.Group>
                <p className="error">
                  {error}
                </p>
                <Button variant="primary" type="submit">
                  Sign Up
                </Button><br />
                <Form.Text className="text-muted">Have an account?</Form.Text><br />
                <Button variant="success" type="submit" onClick={() => history.push("/Login")}>Log in</Button>
              </Form>
            )
          }



        </Col>
      </Row>
    </Container>
  )
}
function Login() {
  const history = useHistory();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    if (email && password) {
      setMessage("waiting");
      loginAccount();
    }
    else {
      setError("Please enter the required(*) fields")
    }
  }
  function loginAccount() {
    fetch("https://password-reset-ranjith.herokuapp.com/users/Login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message));
  };

  return (
    <Container className="container">
      <Row>
        <Col xs='auto' sm='7' md='6' lg='4'>
        {message === "waiting" ?
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            :
          (message ? message :
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  <span className="error">*</span>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  <span className="error">*</span>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
              </Form.Group>
              <p className="error">
                {error}
              </p>
              <Button variant="success" type="submit">
                Login
              </Button><br />
              <Link to="/Forgot" className="link">
                Forgot password?
              </Link><br />
              <Button variant="primary" className="centre-button" onClick={() => history.push('/SignUp')}>
                Create account
              </Button>
            </Form>
  )
          }
        </Col>
      </Row>
    </Container>
  )
}
export default App;