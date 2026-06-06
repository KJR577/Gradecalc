import React from "react";
import "./Loginpage.css";
import { useNavigate } from "react-router-dom";

function Loginpage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const dno = document.getElementById("dno").value.trim();

    const nameErr = document.getElementById("nameErr");
    const dnoErr = document.getElementById("dnoErr");

    let valid = true;

    if (!name) {
      nameErr.classList.add("visible");
      valid = false;
    } else {
      nameErr.classList.remove("visible");
    }

   
    if (!dno) {
      dnoErr.innerText = "Please enter your D Number.";
      dnoErr.classList.add("visible");
      valid = false;
    } else if (dno.length != 8) {
      
      dnoErr.innerText = "D Number must be exactly 8 characters (e.g., 24ucs554).";
      dnoErr.classList.add("visible");
      valid = false;
    } else {
      dnoErr.classList.remove("visible");
    }


    if (valid) {
      navigate("/details", {
        state: {
          name,
          dno,
        },
      });
    }
  };

  return (
    <div className="login-page">
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="header-brand">
            <div className="brand-icon">G</div>
            <span className="brand-name">
              Grade<span>Calc</span>
            </span>
          </a>
        </div>
      </header>

      <main className="login-main">
        <div className="login-card">
          <div className="login-card-header">
            <div className="card-icon">🎓</div>
            <p>Enter your details to continue</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                autoComplete="name"
              />
              <span id="nameErr" className="error-msg">
                Please enter your name.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="dno">D Number</label>
              <input
                id="dno"
                type="text"
                placeholder="Enter your D Number (e.g., 24UCS554)"
                autoComplete="username"
                maxLength={8} 
              />
              <span id="dnoErr" className="error-msg">
                Please enter your D Number.
              </span>
            </div>

            <button type="submit" className="submit-btn">
              Sign In
            </button>
          </form>

          <div className="login-footer-note">
            Need help?{" "}
            <a href="https://www.linkedin.com/in/kenvin-jose-roys577">
              Contact support
            </a>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} GradeCalc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Loginpage;