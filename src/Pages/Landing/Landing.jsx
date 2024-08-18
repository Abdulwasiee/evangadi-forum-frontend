import React from "react";
import Layout from "../../components/Layout/Layout";
import About from "../../components/About/About";
import { Route, Routes } from "react-router-dom";
import Register from "../../components/Register/Register";
import SignIn from "../../components/SignIn/SignIn";
import "./Landing.css";

function Landing() {
  return (
    <>
      <Layout>
        <section className="landing-container">
          <div className="authentication-container">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Register />} />
              <Route path="/signIn" element={<SignIn />} />
            </Routes>
          </div>
          <div className="about-container">
            <About />
          </div>
        </section>
      </Layout>
    </>
  );
}

export default Landing;
