import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { FaArrowRight } from "react-icons/fa";

import "./Question.css";
import { axiosInstance } from "../../utility/axios";

function QuestionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to add a tag
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await axiosInstance.post(
        "/api/question/post",
        {
          title,
          description,
          tags: tags.length ? tags : null, // Send tags as an array
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, // Ensure Bearer token format
          },
        }
      );

      // Axios response does not require .json() method
      const result = response.data;

      setSuccess(result.msg || "Question posted successfully.");
      setTitle("");
      setDescription("");
      setTags([]);
      setError("");
    } catch (error) {
      console.error("Error posting question:", error);
      setError("Error posting question. Please try again.");
      setSuccess("");
    }
  };

  return (
    <Layout>
      <section className="question-container">
        <h1 className="title">Steps To Write A Good Question</h1>
        <ul className="steps-list">
          <li>
            <FaArrowRight className="list-icon" />
            Summarize your problem in a one-line title
          </li>
          <li>
            <FaArrowRight className="list-icon" />
            Describe your problem in more detail
          </li>
          <li>
            <FaArrowRight className="list-icon" />
            Explain what you tried and what you expected to happen
          </li>
          <li>
            <FaArrowRight className="list-icon" />
            Review your question and post it here
          </li>
        </ul>
        <div className="post-question-form">
          <h2 className="form-title">Post Your Question Here</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="question-title-input"
              placeholder="Question title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="question-details-textarea"
              placeholder="Question details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <div className="tag-container">
              <input
                type="text"
                className="tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag (optional)"
              />
              <button
                className="add-tag-button"
                type="button"
                onClick={handleAddTag}
              >
                Add Tag
              </button>
              <div className="tags-list">
                {tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button type="submit" className="submit-button">
              Submit Question
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      </section>
    </Layout>
  );
}

export default QuestionPage;
