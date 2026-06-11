import React, { useState } from "react";
import "./Details.css";
import { useNavigate, useLocation } from "react-router-dom";

function Details() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedName = location.state?.name || "";
  const passedDno = location.state?.dno || "";

  const [formData, setFormData] = useState({
    name: passedName,
    dno: passedDno,
    department: "",
    semester: "",
    degree: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "degree" ? { semester: "" } : {}),
    }));
  };

  const handleSubmit = () => {
    const { name, dno, department, semester, degree } = formData;

    if (!name || !dno || !department || !semester || !degree) {
      alert("Please fill all fields");
      return;
    }

    console.log(formData);

    navigate("/calculator", {
      state: { studentInfo: formData },
    });
  };

  const semesterOptions =
    formData.degree === "PG"
      ? [1, 2, 3, 4]
      : [1, 2, 3, 4, 5, 6];

  return (
    <div className="details-page">
      <header className="details-header"></header>

      <div className="details-card">
        <p className="greeting-msg">
          <b>👋 HI,{passedName || "Student"}</b>
        </p>

        <h1>Student Details</h1>

        <p className="subtitle">
          Fill in your academic information before proceeding.
        </p>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Registration Number</label>
          <input
            type="text"
            name="dno"
            placeholder="Enter your Registration Number"
            value={formData.dno}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            placeholder="Enter your department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Degree</label>
          <input
            type="text"
            name="degree"
            placeholder="UG / PG"
            list="pro"
            value={formData.degree}
            onChange={handleChange}
          />
          <datalist id="pro">
            <option value="UG" />
            <option value="PG" />
          </datalist>
        </div>

        <div className="form-group">
          <label>Semester</label>
          <input
            type="number"
            name="semester"
            placeholder="Enter your semester"
            list="sem"
            value={formData.semester}
            onChange={handleChange}
          />
          <datalist id="sem">
            {semesterOptions.map((sem) => (
              <option key={sem} value={sem} />
            ))}
          </datalist>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Details;