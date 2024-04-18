import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  LandingPage,
  LoginPage,
  PostDetailPage,
  RegisterPage,
  UserDetailPage,
} from "./pages";
import { ErrorBoundary, Feed, Header } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useProvideAuth } from "./hooks/useAuth";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

const App = () => {
  const {
    state: { user },
  } = useProvideAuth();

  const [profileImage, setProfileImage] = useState(getRandomProfileUrl());

  function getRandomProfileUrl() {
    //geneartes random pic in img
    let imgs = [
      "bird.svg",
      "dog.svg",
      "fox.svg",
      "frog.svg",
      "lion.svg",
      "owl.svg",
      "tiger.svg",
      "whale.svg",
    ];
    let img = imgs[Math.floor(Math.random() * imgs.length)];
    return `/${img}`;
  }

  return (
    <ErrorBoundary>
      <ToastContainer />
      {user ? (
        <>
          <Header />
          <Container
            fluid
            style={{
              height: "calc(100vh - 72px)",
              overflow: "auto",
            }}
          >
            <Row>
              <Col xs={0} md={2} xl={3} />
              <Col xs={12} md={8} xl={6}>
                <Routes>
                  <Route exact path="/u/:uname" element={<UserDetailPage profileImage= {profileImage} setProfileImage={setProfileImage}/>} />
                  <Route exact path="/p/:pid" element={<PostDetailPage />} />
                  <Route exact path="/" element={<Feed />} />
                  <Route exact path="/login" element={<Navigate to="/" />} />
                  <Route exact path="/register" element={<Navigate to="/" />} />
                  <Route
                    element={({ location }) => {
                      return (
                        <div
                          style={{
                            padding: "50px",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          The page <code>{location.pathname}</code> could not be
                          found.
                        </div>
                      );
                    }}
                  />
                </Routes>
              </Col>
              <Col xs={0} md={2} xl={3} />
            </Row>
          </Container>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage profileImage= {profileImage} setProfileImage={setProfileImage}/>} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      )}
    </ErrorBoundary>
  );
};

export default App;
