import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaUserCircle, FaEdit, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import "./Answer.css";
import Layout from "../../components/Layout/Layout";
import { axiosInstance } from "../../utility/axios";

const AnswerPage = () => {
  const { questionId } = useParams();
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [question, setQuestion] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionResponse, answersResponse] = await Promise.all([
          axiosInstance.get(`/api/question/${questionId}`),
          axiosInstance.get(`/api/answer/${questionId}`),
        ]);

        if (questionResponse.data.question) {
          setQuestion(questionResponse.data.question);
        }

        if (answersResponse.data.answers) {
          const sortedAnswers = answersResponse.data.answers.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setAnswers(sortedAnswers);
          setError(null);
        } else {
          setError(answersResponse.data.msg || "Unexpected response format");
        }
      } catch (err) {
        const errorMsg = err.response?.data?.msg || "Failed to fetch data";
        setError(errorMsg);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [questionId, refresh]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axiosInstance.get("/api/user/checkUser", {
            headers: {
              Authorization: `${token}`, // Added Bearer prefix
            },
          });
          setUserName(response.data.user.username);
        }
      } catch (err) {
        console.error("Error checking user:", err);
      }
    };

    checkUser();
  }, []);

  const handleAnswerChange = (event) => {
    setNewAnswer(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await axiosInstance.post(
          "/api/answer",
          { questionid: questionId, answer: newAnswer },
          {
            headers: {
              Authorization: `${token}`, // Added Bearer prefix
            },
          }
        );
        setNewAnswer("");
        setRefresh((prev) => !prev);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to post answer";
      setError(errorMsg);
      console.error("Error posting answer:", err);
    }
  };

  const handleDelete = (answerId) => {
    setConfirmDelete(answerId);
  };

  const confirmDeleteAnswer = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token && confirmDelete) {
        await axiosInstance.delete(`/api/answer/${confirmDelete}`, {
          headers: {
            Authorization: `${token}`, // Added Bearer prefix
          },
        });
        setConfirmDelete(null); // Reset confirmation
        setRefresh((prev) => !prev);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to delete answer";
      setError(errorMsg);
      console.error("Error deleting answer:", err);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const timeAgo = question
    ? formatDistanceToNow(new Date(question.created_at), { addSuffix: true })
    : "";

  return (
    <Layout>
      <div className="answer-page">
        <div className="question-container">
          <h1>Question</h1>
          {question ? (
            <>
              <h2 className="question-title">Title: {question.title}</h2>
              <p>{question.description}</p>
              <small>{timeAgo}</small>
            </>
          ) : (
            <p>Loading question...</p>
          )}
        </div>
        <hr />
        <h1 className="from-community">Answer from Community</h1>
        {error && <p className="error-message">{error}</p>}
        <ul className="answers-list">
          {answers.length > 0 ? (
            answers.map((answer) => (
              <li key={answer.id} className="answer-item">
                <FaUserCircle className="profile-icon" />
                <div className="answer-details">
                  <span className="answer-text">
                    &ldquo;{answer.answer}&rdquo;
                  </span>
                  <span className="answer-provider">
                    {answer.firstname} {answer.lastname}
                  </span>
                  {userName === answer.username && (
                    <div className="answer-actions">
                      <Link
                        to={`/edit-answer/${answer.id}/${questionId}`}
                        className="edit-link"
                      >
                        <FaEdit className="edit-icon" />
                      </Link>
                      <button
                        onClick={() => handleDelete(answer.id)}
                        className="delete-button"
                      >
                        <FaTrash className="delete-icon" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p>No answers available</p>
          )}
        </ul>
        {userName && (
          <form onSubmit={handleSubmit} className="answer-form">
            <textarea
              value={newAnswer}
              onChange={handleAnswerChange}
              placeholder="Write your answer here..."
              required
            />
            <button type="submit">Submit Answer</button>
          </form>
        )}
        {confirmDelete && (
          <div className="confirmation-dialog">
            <div className="confirmation-dialog-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this answer?</p>
              <div className="confirmation-buttons">
                <button
                  onClick={confirmDeleteAnswer}
                  className="confirm-button"
                >
                  Yes
                </button>
                <button onClick={cancelDelete} className="cancel-button">
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnswerPage;
