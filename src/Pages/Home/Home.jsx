import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../../utility/axios";
import Layout from "../../components/Layout/Layout";
import Question from "../../components/QuestionList/Question";
import { FaUserCircle, FaEdit, FaTrash } from "react-icons/fa";
import debounce from "lodash/debounce";
import "./Home.css";

function Home() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // Spinner state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get("/api/question/get");
        const sortedQuestions = response.data.questions.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setQuestions(sortedQuestions);
        setFilteredQuestions(sortedQuestions);
      } catch (err) {
        setError("Failed to fetch questions");
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, []);

  const debounceSearch = useCallback(
    debounce((searchTerm) => {
      const filtered = questions.filter((question) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          question.title.toLowerCase().includes(searchLower) ||
          (question.tag && question.tag.toLowerCase().includes(searchLower)) ||
          (question.firstname &&
            question.firstname.toLowerCase().includes(searchLower)) ||
          (question.description &&
            question.description.toLowerCase().includes(searchLower))
        );
      });
      setFilteredQuestions(filtered);
    }, 300),
    [questions]
  );

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (token) {
          const response = await axiosInstance.get("/api/user/checkUser", {
            headers: {
              Authorization: `${token}`,
            },
          });

          setUserName(response.data.user.username);
          setUserId(response.data.user.id);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking user:", err);
        setIsAuthenticated(false);
      }
    };

    checkUser();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (questionId) => {
    navigate(`/editQuestion/${questionId}`);
  };

  const handleDelete = (questionId) => {
    setQuestionToDelete(questionId);
    setConfirmDelete(true);
  };

  const confirmDeleteAction = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    setIsDeleting(true); // Show spinner

    try {
      await axiosInstance.delete(`/api/question/${questionToDelete}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setQuestions(questions.filter((q) => q.questionid !== questionToDelete));
      setFilteredQuestions(
        filteredQuestions.filter((q) => q.questionid !== questionToDelete)
      );
      setConfirmDelete(false);
      setQuestionToDelete(null);
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question");
    } finally {
      setIsDeleting(false); // Hide spinner after completion
    }
  };

  const cancelDeleteAction = () => {
    setConfirmDelete(false);
    setQuestionToDelete(null);
  };

  return (
    <Layout>
      <div className="questions-container">
        <section className="header">
          <Link to="/postQuestion">
            <button className="ask">Ask Question</button>
          </Link>
          <div className="user-welcome">
            <FaUserCircle className="welcome-icon" />
            <span className="user-name">
              {userName ? `Welcome, ${userName}` : "Welcome, Guest"}
            </span>
          </div>
        </section>
        <h2>Questions</h2>
        <section className="search-bar">
          <input
            type="text"
            placeholder="Search by title, tag, asker's name, or description..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </section>

        {error && <p className="error-message">{error}</p>}
        <ul className="questions-list">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <li key={question.questionid} className="question-item">
                <div className="action-buttons">
                  {isAuthenticated && (
                    <>
                      {userId === question.user_id && (
                        <>
                          <FaEdit
                            className="edit-icon"
                            onClick={() => handleEdit(question.questionid)}
                          />
                          <FaTrash
                            className="delete-icon"
                            onClick={() => handleDelete(question.questionid)}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
                <Question question={question} searchTerm={searchTerm} />
              </li>
            ))
          ) : (
            <p>No questions found</p>
          )}
        </ul>

        {confirmDelete && (
          <div className="confirmation-dialog">
            <div className="confirmation-dialog-content">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this question?</p>
              <div className="confirmation-buttons">
                <button
                  className="confirm-button"
                  onClick={confirmDeleteAction}
                  disabled={isDeleting} // Disable button during delete action
                >
                  {isDeleting ? "Deleting..." : "Confirm"} {/* Spinner text */}
                </button>
                <button className="cancel-button" onClick={cancelDeleteAction}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;
