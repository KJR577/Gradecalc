import React, { useState } from "react";
import "./Calculator.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLocation, useNavigate } from "react-router-dom";

function Calculator() {
  const location = useLocation();
  const navigate = useNavigate();


  const student = location.state?.studentInfo || {};
  const name = student.name || "Student";
  const dno = student.dno || "N/A";
  const department = student.department || "N/A";
  const semester = student.semester || "N/A";
  const degree = student.degree || "UG"; 

  const isPG = degree.trim().toUpperCase() === "PG";

  
  const [sgpaRows, setSgpaRows] = useState([
    { id: 1, subject: "", cia: "", sem: "", credit: "", total: "", grade: "", gp: "" },
    { id: 2, subject: "", cia: "", sem: "", credit: "", total: "", grade: "", gp: "" },
    { id: 3, subject: "", cia: "", sem: "", credit: "", total: "", grade: "", gp: "" },
    { id: 4, subject: "", cia: "", sem: "", credit: "", total: "", grade: "", gp: "" },
    { id: 5, subject: "", cia: "", sem: "", credit: "", total: "", grade: "", gp: "" },
  ]);

  const [cgpaRows, setCgpaRows] = useState([
    { id: 1, sgpa: "", credit: "" }
  ]);

  const [finalSGPA, setFinalSGPA] = useState(null);
  const [finalCGPA, setFinalCGPA] = useState(null);


  const getGrade = (mark) => {
    if (mark >= 90) return { grade: "O", gp: 10 };
    if (mark >= 80) return { grade: "A+", gp: 9 };
    if (mark >= 70) return { grade: "B+", gp: 8 };
    if (mark >= 60) return { grade: "B", gp: 7 };
    if (mark >= 50) return { grade: "C+", gp: 6 };
    
   
    if (isPG) {
      return { grade: "RA", gp: 0 };
    }

    
    if (mark >= 40) return { grade: "C", gp: 5 };
    return { grade: "RA", gp: 0 };
  };


  const handleSgpaChange = (id, field, value) => {
    setSgpaRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };

          if (field === "cia" || field === "sem") {
            const ciaNum = Number(updatedRow.cia) || 0;
            const semNum = Number(updatedRow.sem) || 0;
            
          
            const total = ciaNum && semNum ? Math.round((ciaNum + semNum) / 2) : (ciaNum + semNum);
            const { grade, gp } = getGrade(total);

            updatedRow.total = total;
            updatedRow.grade = grade;
            updatedRow.gp = gp;
          }
          return updatedRow;
        }
        return row;
      })
    );
  };

  const addRow = () => {
    if (sgpaRows.length < 10) {
      const nextId = sgpaRows.length + 1;
      setSgpaRows([...sgpaRows, { id: nextId, subject: "", cia: "", sem: "", credit: "", total: "", grade: "", gp: "" }]);
    }
  };

  const deleteRow = () => {
    if (sgpaRows.length > 5) {
      setSgpaRows(sgpaRows.slice(0, -1));
    }
  };

  const calculateSGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;
    let hasEmptyCredits = false;

    sgpaRows.forEach((row) => {
      const credit = Number(row.credit) || 0;
      const gp = Number(row.gp) || 0;

      if (credit === 0) {
        hasEmptyCredits = true;
      }

      totalGradePoints += gp * credit;
      totalCredits += credit;
    });

    if (hasEmptyCredits) {
      alert("Warning: Some rows have missing or zero credits. Please make sure to enter credits for accurate calculations.");
    }

    const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";
    setFinalSGPA(sgpa);
  };

  const handleCgpaChange = (id, field, value) => {
    setCgpaRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addRowc = () => {
    if (cgpaRows.length < 6) {
      const nextId = cgpaRows.length + 1;
      setCgpaRows([...cgpaRows, { id: nextId, sgpa: "", credit: "" }]);
    }
  };

  const deleteRowc = () => {
    if (cgpaRows.length > 1) {
      setCgpaRows(cgpaRows.slice(0, -1));
    }
  };

  const calculateCGPA = () => {
    let totalWeightedSGPA = 0;
    let totalCredits = 0;

    cgpaRows.forEach((row) => {
      const sgpa = Number(row.sgpa) || 0;
      const credit = Number(row.credit) || 0;
      totalWeightedSGPA += sgpa * credit;
      totalCredits += credit;
    });

    const cgpa = totalCredits > 0 ? (totalWeightedSGPA / totalCredits).toFixed(2) : "0.00";
    setFinalCGPA(cgpa);
    alert(`Your CGPA is ${cgpa}`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SGPA & CGPA Academic Report", 14, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${name}`, 14, 28);
    doc.text(`D Number: ${dno}`, 14, 35);
    doc.text(`Degree: ${degree}`, 110, 28);
    doc.text(`Department: ${department}`, 110, 35);
    doc.text(`Current Semester: ${semester}`, 14, 42);

    doc.setDrawColor(220, 227, 239);
    doc.line(14, 47, 196, 47);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Semester Subject Performance (SGPA)", 14, 55);

    const sgpaTableData = sgpaRows.map((row) => [
      row.id,
      row.subject,
      row.cia,
      row.sem,
      row.credit,
      row.total,
      row.grade,
      row.gp,
    ]);

    autoTable(doc, {
      head: [["Sub No", "Subject Name", "CIA", "SEM", "Credits", "Total", "Grade", "GP"]],
      body: sgpaTableData,
      startY: 60,
    });

    const sgpaText = finalSGPA ? `Your SGPA is ${finalSGPA}` : "SGPA: Not Calculated";
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(sgpaText, 14, doc.lastAutoTable.finalY + 10);

    doc.setFontSize(13);
    doc.text("Cumulative Performance Overview (CGPA)", 14, doc.lastAutoTable.finalY + 22);

    const cgpaTableData = cgpaRows.map((row) => [row.id, row.sgpa, row.credit]);

    autoTable(doc, {
      head: [["Semester", "SGPA", "Credits"]],
      body: cgpaTableData,
      startY: doc.lastAutoTable.finalY + 27,
    });

    const cgpaText = finalCGPA ? `Your CGPA is ${finalCGPA}` : "CGPA: Not Calculated";
    doc.setFontSize(12);
    doc.text(cgpaText, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`${name}_Grade_Report.pdf`);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="header-brand">
            <div className="brand-icon">G</div>
            <span className="brand-name">Grade<span>Calc</span></span>
          </a>
          <nav className="header-nav">
            <a href="/" className="active">Calculator</a>
            {/* UPDATED: Nav link now downloads your specific asset file directly */}
            <a href="\How GradeCalc Works.pdf" download="How GradeCalc Works.pdf">
              How It Works
            </a>
          </nav>
          <button id="logout" onClick={() => navigate("/")}>Log out</button>
        </div>
      </header>

      <main className="main-content">
        <div className="student-info">
          <div className="info-row">
            <p><strong>Hi</strong> {name} 👋</p>
            <p><strong>D Number:</strong> {dno}</p>
          </div>
          <div className="info-row sub-details">
            <p><strong>Degree:</strong> {degree}</p>
            <p><strong>Department:</strong> {department}</p>
            <p><strong>Semester:</strong> {semester}</p>
          </div>
        </div>

        <h1 className="page-title">Grade Calculator</h1>
        <p className="page-subtitle">Calculate your SGPA and CGPA with ease.</p>

        <div style={{ marginBottom: "20px" }}>
          <button className="download-btn" onClick={downloadPDF}>
            ↓ Download PDF Report
          </button>
        </div>

        {/* SGPA Section */}
        <div className="section-card">
          <div className="section-heading">
            SGPA Calculator <span className="badge">{degree} Mode</span>
          </div>
          <div>
            <p>
              <b>NOTE:</b> For course credits, you may use your syllabus PDF or  
              <a href="https://www.sjctni.edu/Courses/Syllabus.jsp?&bredcom=%3Ca%20href=/%3EHome%3C/a%3E%20|%20Academics%20|%20Syllabus" > Download Syllabus PDF</a>. 
              Please refer to the course credits listed in your syllabus PDF.
            </p>
            <p>For more Clarification, please Download this PDF: <a href="/CGPA Calculation reference Documentne.pdf" download="CGPA_Calculation_Reference_Guide.pdf">Download Instructions</a></p>
          </div>

          <table id="table1">
            <thead>
              <tr>
                <th>Sub No</th>
                <th>Subject Name</th>
                <th>CIA</th>
                <th>SEM</th>
                <th>Credits</th>
                <th>Total</th>
                <th>Grade</th>
                <th>GP</th>
              </tr>
            </thead>
            <tbody>
              {sgpaRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Subject name"
                      value={row.subject}
                      onChange={(e) => handleSgpaChange(row.id, "subject", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="CIA"
                      value={row.cia}
                      onChange={(e) => handleSgpaChange(row.id, "cia", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="SEM"
                      value={row.sem}
                      onChange={(e) => handleSgpaChange(row.id, "sem", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      list="creditOptions"
                      placeholder="Credit"
                      value={row.credit}
                      onChange={(e) => handleSgpaChange(row.id, "credit", e.target.value)}
                    />
                  </td>
                  <td>{row.total}</td>
                  <td>{row.grade}</td>
                  <td>{row.gp}</td>
                </tr>
              ))}
            </tbody>
          </table>

          

          <div className="button-group">
            <button className="add-btn" onClick={addRow} disabled={sgpaRows.length >= 10}>
              {sgpaRows.length >= 10 ? "Maximum 10 Rows Reached" : "+ Add Row"}
            </button>
            <button className="delete-btn" onClick={deleteRow} disabled={sgpaRows.length <= 5}>
              − Delete Row
            </button>
            <button className="calc-btn" onClick={calculateSGPA}>
              Calculate SGPA
            </button>
          </div>

          <div id="result1" className="result-container">
            Your SGPA is: <strong>{finalSGPA !== null ? finalSGPA : "0.00"}</strong>
          </div>
        </div>

        {/* CGPA Section */}
        <div className="section-card">
          <div className="section-heading">
            CGPA Calculator <span className="badge">Cumulative</span>
          </div>

          <table id="table2">
            <thead>
              <tr>
                <th>Sem No</th>
                <th>SGPA</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {cgpaRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="SGPA"
                      value={row.sgpa}
                      onChange={(e) => handleCgpaChange(row.id, "sgpa", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Credits"
                      value={row.credit}
                      onChange={(e) => handleCgpaChange(row.id, "credit", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="button-group">
            <button className="add-btn" onClick={addRowc} disabled={cgpaRows.length >= 6}>
              {cgpaRows.length >= 6 ? "Maximum 6 Rows Reached" : "+ Add Semester"}
            </button>
            <button className="delete-btn" onClick={deleteRowc} disabled={cgpaRows.length <= 1}>
              − Delete Row
            </button>
            <button className="calc-btn" onClick={calculateCGPA}>
              Calculate CGPA
            </button>
          </div>

          <div id="result2" className="result-container">
            Your CGPA is: <strong>{finalCGPA !== null ? finalCGPA : "0.00"}</strong>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand-col">
              <a href="/" className="footer-logo">
                <div className="brand-icon">G</div>
                <span>GradeCalc</span>
              </a>
              <p>A simple, fast tool to calculate your SGPA and CGPA.</p>
            </div>
          </div>
          <br />
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} GradeCalc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Calculator;