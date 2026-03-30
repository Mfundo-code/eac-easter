import React, { useState } from 'react';

const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000/api'
  : 'https://aec.207.180.201.93.sslip.io/api';

async function getCSRFToken() {
  const res = await fetch(`${API_BASE}/admin/csrf/`, { credentials: 'include' });
  const data = await res.json();
  return data.csrfToken;
}

/* ── Global styles ─────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f5f6fa; color: #1a1a1a; }

  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: linear-gradient(135deg, #e8f5e9 0%, #f5f6fa 100%);
  }
  .login-card {
    background: #fff;
    border-radius: 24px;
    padding: 40px 32px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.1);
  }
  .login-icon { text-align: center; font-size: 40px; margin-bottom: 8px; }
  .login-title {
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 28px;
  }
  .login-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .login-field label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #999;
  }
  .login-field input {
    padding: 12px 14px;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    background: #fafafa;
    transition: border-color 0.15s, background 0.15s;
  }
  .login-field input:focus { border-color: #4c8b4c; background: #fff; }
  .login-btn {
    width: 100%;
    margin-top: 8px;
    padding: 13px;
    background: #4c8b4c;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
  }
  .login-btn:hover:not(:disabled) { background: #3d7a3d; }
  .login-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .dashboard { max-width: 720px; margin: 0 auto; padding: 24px 16px 60px; }
  .dash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 1.5px solid #eee;
  }
  .dash-title { font-size: 20px; font-weight: 700; color: #1a1a1a; }
  .dash-count { font-size: 13px; color: #999; font-weight: 500; margin-top: 2px; }
  .logout-btn {
    padding: 8px 16px;
    background: #fff;
    color: #e53e3e;
    border: 1.5px solid #fca5a5;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .logout-btn:hover { background: #fff5f5; }

  .q-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    border: 1.5px solid #f0f0f0;
    transition: box-shadow 0.2s;
  }
  .q-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }

  .q-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .q-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4c8b4c, #81c784);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .q-sender { font-size: 13px; font-weight: 600; color: #555; }
  .q-time { font-size: 11px; color: #bbb; margin-top: 1px; }
  .q-badge {
    margin-left: auto;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }
  .q-badge.answered { background: #d4edda; color: #276749; }
  .q-badge.pending  { background: #fef3cd; color: #856404; }

  .q-text {
    font-size: 17px;
    font-weight: 700;
    color: #111;
    line-height: 1.55;
    letter-spacing: -0.2px;
    margin-bottom: 16px;
    padding: 14px 16px;
    background: #f8f9fa;
    border-radius: 10px;
    border-left: 3px solid #4c8b4c;
  }

  .q-actions { display: flex; gap: 8px; align-items: center; }
  .reply-btn {
    padding: 8px 18px;
    background: #4c8b4c;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .reply-btn:hover { background: #3d7a3d; }
  .reply-btn.open { background: #f0f0f0; color: #555; }
  .reply-btn.open:hover { background: #e8e8e8; }

  .reply-form {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1.5px solid #f0f0f0;
    animation: expandIn 0.18s ease;
  }
  @keyframes expandIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .reply-form textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    resize: vertical;
    outline: none;
    background: #fafafa;
    transition: border-color 0.15s, background 0.15s;
    margin-bottom: 10px;
  }
  .reply-form textarea:focus { border-color: #4c8b4c; background: #fff; }
  .reply-form-actions { display: flex; gap: 8px; justify-content: flex-end; }
  .save-btn {
    padding: 9px 20px;
    background: #4c8b4c;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .save-btn:hover:not(:disabled) { background: #3d7a3d; }
  .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .cancel-reply-btn {
    padding: 9px 16px;
    background: #fff;
    color: #777;
    border: 1.5px solid #e8e8e8;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
  }

  .saved-answer {
    margin-top: 12px;
    padding: 12px 14px;
    background: #f0f9f0;
    border-radius: 10px;
    border-left: 3px solid #4c8b4c;
    font-size: 13px;
    color: #2d5a2d;
    line-height: 1.5;
  }
  .saved-answer-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #4c8b4c;
    margin-bottom: 4px;
  }

  .error-bar {
    background: #fff5f5;
    border: 1px solid #fca5a5;
    color: #c53030;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    margin-bottom: 16px;
  }
  .empty-state { text-align: center; padding: 60px 20px; color: #bbb; }
  .empty-state-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state-text { font-size: 16px; font-weight: 500; }
  .loading-state { text-align: center; padding: 40px; color: #bbb; font-size: 15px; }
`;

function StyleInjector() {
  return <style>{css}</style>;
}

function QuestionCard({ question, answerText, onAnswerChange, onAnswerSubmit, saving }) {
  const [replyOpen, setReplyOpen] = useState(false);

  const initials = question.name ? question.name.trim()[0].toUpperCase() : '?';

  const handleSave = async () => {
    await onAnswerSubmit(question.id);
    setReplyOpen(false);
  };

  return (
    <div className="q-card">
      <div className="q-meta">
        <div className="q-avatar">{initials}</div>
        <div>
          <div className="q-sender">{question.name || 'Anonymous'}</div>
          <div className="q-time">{new Date(question.created_at).toLocaleString()}</div>
        </div>
        <span className={`q-badge ${question.answer ? 'answered' : 'pending'}`}>
          {question.answer ? '✓ Answered' : 'Pending'}
        </span>
      </div>

      <div className="q-text">{question.question_text}</div>

      <div className="q-actions">
        <button
          className={`reply-btn${replyOpen ? ' open' : ''}`}
          onClick={() => setReplyOpen(v => !v)}
        >
          {replyOpen ? '✕ Close' : '↩ Reply'}
        </button>
      </div>

      {question.answer && !replyOpen && (
        <div className="saved-answer">
          <div className="saved-answer-label">Answer</div>
          {question.answer}
        </div>
      )}

      {replyOpen && (
        <div className="reply-form">
          <textarea
            rows={3}
            placeholder="Write your answer..."
            value={answerText[question.id] || ''}
            onChange={e => onAnswerChange(question.id, e.target.value)}
            autoFocus
          />
          <div className="reply-form-actions">
            <button className="cancel-reply-btn" onClick={() => setReplyOpen(false)}>Cancel</button>
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving || !(answerText[question.id] || '').trim()}
            >
              {saving ? 'Saving…' : 'Save Answer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [answerText, setAnswerText] = useState({});

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/questions/`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      setQuestions(data);
      const init = {};
      data.forEach(q => { init[q.id] = q.answer || ''; });
      setAnswerText(init);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        await fetchQuestions();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/admin/logout/`, { method: 'POST', credentials: 'include' });
    } catch {}
    setIsAuthenticated(false);
    setQuestions([]);
    setAnswerText({});
  };

  const handleAnswerSubmit = async (questionId) => {
    const answer = answerText[questionId];
    setSaving(true);
    try {
      const csrfToken = await getCSRFToken();
      const res = await fetch(`${API_BASE}/admin/questions/${questionId}/answer/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ answer }),
      });
      if (res.ok) {
        setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, answer } : q));
        setError('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save answer');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswerText(prev => ({ ...prev, [questionId]: value }));
  };

  /* ── Login screen ── */
  if (!isAuthenticated) {
    return (
      <>
        <StyleInjector />
        <div className="login-wrap">
          <div className="login-card">
            <div className="login-icon">🐣</div>
            <div className="login-title">Admin Login</div>
            {error && <div className="error-bar">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="login-field">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="login-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  /* ── Dashboard ── */
  const pending = questions.filter(q => !q.answer).length;

  return (
    <>
      <StyleInjector />
      <div className="dashboard">
        <div className="dash-header">
          <div>
            <div className="dash-title">Questions</div>
            <div className="dash-count">
              {pending > 0 ? `${pending} pending · ` : ''}{questions.length} total
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {error && <div className="error-bar">{error}</div>}
        {loading && <div className="loading-state">Loading questions…</div>}

        {!loading && questions.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-text">No questions yet</div>
          </div>
        )}

        {questions.map(question => (
          <QuestionCard
            key={question.id}
            question={question}
            answerText={answerText}
            onAnswerChange={handleAnswerChange}
            onAnswerSubmit={handleAnswerSubmit}
            saving={saving}
          />
        ))}
      </div>
    </>
  );
}

export default Admin;