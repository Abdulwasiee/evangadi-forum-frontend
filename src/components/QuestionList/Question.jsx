import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Question.css";

const highlightText = (text, searchTerm) => {
  if (!searchTerm.trim()) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(
    regex,
    (match) => `<span class="highlight">${match}</span>`
  );
};

const Question = ({ question, searchTerm }) => {
  const { description, created_at, firstname, lastname, questionid } = question;
  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
  });

  return (
    <li className="question-item">
      <div className="question-header">
        <FaUserCircle className="profile-icon" />
        <span className="asker-name">
          {firstname} {lastname}
        </span>
        <span className="question-time">{timeAgo}</span>
      </div>
      <div className="question-content">
        <p
          className="question-description"
          dangerouslySetInnerHTML={{
            __html: highlightText(description, searchTerm),
          }}
        />
        <Link
          to={`/question/${questionid}/answers`}
          className="view-answers-link"
        >
          View Answers
        </Link>
      </div>
    </li>
  );
};

export default Question;
