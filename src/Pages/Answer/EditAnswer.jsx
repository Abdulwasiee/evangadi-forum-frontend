import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/axios";
import Layout from "../../components/Layout/Layout";
import "./EditAnswer.css";

const EditAnswerPage = () => {
  const { answerId ,questionId} = useParams();
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch the current answer details
  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axiosInstance.get(
            `/api/answer/single/${answerId}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          setAnswer(response.data.answer.answer);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.msg || "Failed to fetch answer";
        setError(errorMsg);
        console.error("Error fetching answer:", err);
      }
    };

    fetchAnswer();
  }, [answerId]);

  // Handle change in the answer input field
  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  // Handle form submission to update the answer
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await axiosInstance.put(
          `/api/answer/${answerId}`,
          { answer },
          {
            headers: {
              Authorization: `${token}`, // Added Bearer prefix
            },
          }
        );
        navigate(`/question/${questionId}/answers`); // Navigate back to the answer page
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to update answer";
      setError(errorMsg);
      console.error("Error updating answer:", err);
    }
  };

  return (
    <Layout>
      <div className="edit-answer-page">
        <h1>Edit Answer</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="edit-answer-form">
          <textarea
            value={answer}
            onChange={handleAnswerChange}
            placeholder="Edit your answer here..."
            required
          />
          <button type="submit">Update Answer</button>
        </form>
      </div>
    </Layout>
  );
};

export default EditAnswerPage;
