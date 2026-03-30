import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import backgroundImage from './background.png';
import Admin from './admin';

const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000/api'
  : 'https://aec.207.180.201.93/api';

const API_URL = `${API_BASE}/questions/`;

/* ─── Injected global styles ─────────────────────────────────── */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'DM Sans', sans-serif; }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.18s ease;
  }

  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  .modal {
    background: #fff;
    border-radius: 20px;
    width: 100%;
    max-width: 420px;
    padding: 28px 24px 24px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18);
    animation: slideUp 0.22s cubic-bezier(.34,1.4,.64,1);
  }

  @keyframes slideUp {
    from { transform: translateY(24px); opacity: 0 }
    to   { transform: translateY(0);    opacity: 1 }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: -0.3px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: #f0f0f0;
    color: #555;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .close-btn:hover { background: #e0e0e0; }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }

  .field label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #888;
  }

  .field input,
  .field textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #1a1a1a;
    background: #fafafa;
    transition: border-color 0.15s, background 0.15s;
    outline: none;
    resize: vertical;
  }

  .field input:focus,
  .field textarea:focus {
    border-color: #4c8b4c;
    background: #fff;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 6px;
  }

  .btn-cancel {
    flex: 1;
    padding: 12px;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #555;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-cancel:hover { background: #f5f5f5; }

  .btn-submit {
    flex: 2;
    padding: 12px;
    border: none;
    border-radius: 10px;
    background: #4c8b4c;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
  }
  .btn-submit:hover:not(:disabled) { background: #3d7a3d; }
  .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  .success-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a1a;
    color: #fff;
    padding: 12px 20px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 500;
    z-index: 2000;
    white-space: nowrap;
    animation: toastIn 0.25s cubic-bezier(.34,1.4,.64,1);
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }

  @keyframes toastIn {
    from { transform: translateX(-50%) translateY(12px); opacity: 0 }
    to   { transform: translateX(-50%) translateY(0);   opacity: 1 }
  }

  .admin-btn {
    position: fixed;
    top: 14px;
    right: 14px;
    padding: 7px 14px;
    border-radius: 20px;
    background: rgba(255,255,255,0.9);
    color: #333;
    border: 1.5px solid #ddd;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    backdrop-filter: blur(4px);
    z-index: 100;
    transition: background 0.15s;
  }
  .admin-btn:hover { background: #fff; }

  .qr-card {
    margin-top: 339px;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .qr-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.16); transform: translateY(-2px); }

  .qr-label {
    font-size: 13px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .ask-chip {
    padding: 9px 22px;
    background: #4c8b4c;
    color: #fff;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
`;

function StyleInjector() {
  return <style>{globalCSS}</style>;
}

function MainApp() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', question_text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question_text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          question_text: formData.question_text,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        setFormData({ name: '', question_text: '' });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to submit');
      }
    } catch (err) {
      console.error('Submission error', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <StyleInjector />

      {/* Background page */}
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 16,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}>
        <button className="admin-btn" onClick={() => navigate('/admin')}>
          Admin ↗
        </button>

        {/* QR card */}
        <div className="qr-card" onClick={() => setModalOpen(true)}>
          {currentUrl && <QRCodeSVG value={currentUrl} size={160} />}
          <button className="ask-chip" onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}>
            Ask a Question
          </button>
        </div>
      </div>

      {/* Centered modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Ask a Question</span>
              <button className="close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Optional"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label>Your question</label>
                <textarea
                  name="question_text"
                  placeholder="Type your question here..."
                  rows={4}
                  value={formData.question_text}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success toast */}
      {success && (
        <div className="success-toast">
          ✅ Question submitted — thank you!
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;