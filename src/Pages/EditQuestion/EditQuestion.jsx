import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/axios";
import "./editQuestion.css";
import Layout from "../../components/Layout/Layout";

function EditQuestion() {
  const { questionId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axiosInstance.get(`/api/question/${questionId}`);
        const { title, description, tag } = response.data.question;
        setTitle(title || "");
        setDescription(description || "");
        setTags(tag || "");
      } catch (err) {
        console.error("Error fetching question:", err);
        setError("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axiosInstance.put(
        `/api/question/${questionId}`,
        {
          title,
          description,
          tag: tags,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      navigate("/home"); // Redirect to home after successful edit
    } catch (err) {
      console.error("Error updating question:", err);
      setError("Failed to update question");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="edit-question-container">
        <h2>Edit Question</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-submit">
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default EditQuestion;
