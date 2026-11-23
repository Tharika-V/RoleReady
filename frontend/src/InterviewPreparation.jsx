import { useState, useEffect } from "react";
import { apiRequest } from "./api";
import "./InterviewPreparation.css";

function InterviewPreparation({ token }) {
    const [questions, setQuestions] = useState([]);
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [revealed, setRevealed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState([]);

    // LOAD INTERVIEW QUESTIONS
    async function loadQuestions() {
        if (!token) {
            setLoading(false);
            setError("Please log in to access interview preparation.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await apiRequest(
                "/interview",
                "GET",
                null,
                token
            );

            if (!Array.isArray(data)) {
                throw new Error(
                    data.message || "Unexpected response from server."
                );
            }

            setQuestions(data);

        } catch (err) {
            console.error("Interview API error:", err);

            setError(
                err.message === "Failed to fetch" ||
                err.message === "Load failed"
                    ? "Cannot connect to the RoleReady backend. Please check that your backend server is running on port 5001."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadQuestions();
    }, [token]);

    // UPDATE PROGRESS OR BOOKMARK
    async function updateProgress(id, updates) {
        if (updating.includes(id)) return;

        setUpdating(previous => [...previous, id]);

        try {
            await apiRequest(
                `/interview/${id}/progress`,
                "PATCH",
                updates,
                token
            );

            setQuestions(previous =>
                previous.map(question =>
                    question.id === id
                        ? { ...question, ...updates }
                        : question
                )
            );

        } catch (err) {
            console.error("Progress update error:", err);
            setError(err.message || "Could not update question progress.");
        } finally {
            setUpdating(previous =>
                previous.filter(item => item !== id)
            );
        }
    }

    // SHOW OR HIDE ANSWER
    function toggleAnswer(id) {
        setRevealed(previous =>
            previous.includes(id)
                ? previous.filter(item => item !== id)
                : [...previous, id]
        );
    }

    // CHECK BOOKMARK STATUS
    function isSaved(question) {
        return Number(question.is_saved) === 1 ||
            question.is_saved === true;
    }

    // FILTER QUESTIONS
    const filteredQuestions = questions.filter(question => {
        const matchesCategory =
            category === "All" || question.category === category;

        const searchText = search.toLowerCase();

        const matchesSearch =
            question.question.toLowerCase().includes(searchText) ||
            question.topic.toLowerCase().includes(searchText);

        const matchesSaved =
            category !== "Saved" || isSaved(question);

        return matchesCategory && matchesSearch && matchesSaved;
    });

    // STATISTICS
    const completed = questions.filter(
        question => question.status === "Completed"
    ).length;

    const attempted = questions.filter(
        question => question.status === "Attempted"
    ).length;

    const saved = questions.filter(isSaved).length;

    const progress = questions.length
        ? Math.round((completed / questions.length) * 100)
        : 0;

    return (
        <section
            className="interview-container"
            id="interview-preparation"
        >

            {/* HEADER */}
            <div className="interview-header">
                <div>
                    <span className="interview-label">
                        CAREER DEVELOPMENT
                    </span>

                    <h2>Interview Preparation Hub</h2>

                    <p>
                        Practice technical and HR questions
                        and prepare confidently for your next interview.
                    </p>
                </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="interview-error">
                    <p>{error}</p>

                    <button onClick={loadQuestions}>
                        Retry
                    </button>
                </div>
            )}

            {/* LOADING */}
            {loading ? (
                <div className="interview-empty">
                    Loading interview questions...
                </div>
            ) : (
                <>
                    {/* STATISTICS */}
                    <div className="interview-stats">

                        <div className="interview-stat-card">
                            <h3>{questions.length}</h3>
                            <p>Total Questions</p>
                        </div>

                        <div className="interview-stat-card">
                            <h3>{attempted}</h3>
                            <p>Attempted</p>
                        </div>

                        <div className="interview-stat-card">
                            <h3>{completed}</h3>
                            <p>Completed</p>
                        </div>

                        <div className="interview-stat-card">
                            <h3>{saved}</h3>
                            <p>Saved Questions</p>
                        </div>

                    </div>

                    {/* OVERALL PROGRESS */}
                    <div className="interview-progress">

                        <div className="interview-progress-heading">
                            <strong>
                                Overall Preparation Progress
                            </strong>

                            <span>{progress}%</span>
                        </div>

                        <div className="interview-progress-track">
                            <div
                                className="interview-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                    </div>

                    {/* SEARCH AND FILTERS */}
                    <div className="interview-filters">

                        <div className="interview-category-buttons">

                            {["All", "Technical", "HR", "Saved"].map(item => (
                                <button
                                    key={item}
                                    className={
                                        category === item ? "active" : ""
                                    }
                                    onClick={() => setCategory(item)}
                                >
                                    {item}
                                </button>
                            ))}

                        </div>

                        <input
                            type="text"
                            placeholder="Search questions or topics..."
                            value={search}
                            onChange={event =>
                                setSearch(event.target.value)
                            }
                        />

                    </div>

                    {/* QUESTION LIST */}
                    <div className="interview-question-list">

                        {filteredQuestions.length === 0 ? (
                            <p className="interview-empty">
                                {questions.length === 0
                                    ? "No interview questions are available."
                                    : "No matching questions found."}
                            </p>
                        ) : (
                            filteredQuestions.map((question, index) => (

                                <div
                                    className="interview-question-card"
                                    key={question.id}
                                >

                                    <div className="interview-question-top">

                                        <span className="interview-topic">
                                            {question.topic}
                                        </span>

                                        <span className="interview-difficulty">
                                            {question.difficulty}
                                        </span>

                                    </div>

                                    <h3>
                                        {index + 1}. {question.question}
                                    </h3>

                                    {/* QUESTION ACTIONS */}
                                    <div className="interview-question-actions">

                                        <button
                                            onClick={() =>
                                                toggleAnswer(question.id)
                                            }
                                        >
                                            {revealed.includes(question.id)
                                                ? "Hide Suggested Answer"
                                                : "View Suggested Answer"}
                                        </button>

                                        <button
                                            className="interview-save-button"
                                            disabled={updating.includes(question.id)}
                                            onClick={() =>
                                                updateProgress(question.id, {
                                                    is_saved: !isSaved(question)
                                                })
                                            }
                                        >
                                            {isSaved(question)
                                                ? "★ Saved"
                                                : "☆ Save"}
                                        </button>

                                    </div>

                                    {/* SUGGESTED ANSWER */}
                                    {revealed.includes(question.id) && (
                                        <div className="interview-answer">

                                            <strong>
                                                Suggested Answer
                                            </strong>

                                            <p>
                                                {question.suggested_answer}
                                            </p>

                                        </div>
                                    )}

                                    {/* PRACTICE STATUS */}
                                    <div className="interview-status-row">

                                        <label>
                                            Practice Status
                                        </label>

                                        <select
                                            value={question.status}
                                            disabled={updating.includes(question.id)}
                                            onChange={event =>
                                                updateProgress(question.id, {
                                                    status: event.target.value
                                                })
                                            }
                                        >
                                            <option value="Not Started">
                                                Not Started
                                            </option>

                                            <option value="Attempted">
                                                Attempted
                                            </option>

                                            <option value="Completed">
                                                Completed
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            ))
                        )}

                    </div>
                </>
            )}

        </section>
    );
}

export default InterviewPreparation;