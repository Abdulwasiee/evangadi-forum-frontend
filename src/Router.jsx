import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import QuestionPage from "./Pages/Question/QuestionPage";
import Landing from "./Pages/Landing/Landing";
import AnswerPage from "./Pages/Answer/Answer";
import Protect from "./components/Protection/Protect";
import EditQuestion from "./Pages/EditQuestion/EditQuestion";
import EditAnswerPage from './Pages/Answer/EditAnswer';

function Router() {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <Protect>
            <Home />
          </Protect>
        }
      />
      <Route
        path="/editQuestion/:questionId" // Updated path to match Home component's usage
        element={
          <Protect>
            <EditQuestion />
          </Protect>
        }
      />
      <Route
        path="/edit-answer/:answerId/:questionId" 
        element={
          <Protect>
            <EditAnswerPage />
          </Protect>
        }
      />
      <Route
        path="/postQuestion"
        element={
          <Protect>
            <QuestionPage />
          </Protect>
        }
      />
      <Route
        path="/question/:questionId/answers"
        element={
          <Protect>
            <AnswerPage />
          </Protect>
        }
      />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default Router;
