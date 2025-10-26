import React, { useState } from 'react';
import './Merit.css';

const Merit = () => {
  const [name, setName] = useState('');
  const [num, setNum] = useState('');
  const [mail, setMail] = useState('');
  const [marks10, setMarks10] = useState('');
  const [marks12, setMarks12] = useState('');
  const [income, setIncome] = useState('');
  const [category, setCategory] = useState('');

  const [HandleForm, setForm] = useState(true);

  // Scheme states
  const [B1, setB1] = useState(false);
  const [B2, setB2] = useState(false);
  const [B3, setB3] = useState(false);
  const [B4, setB4] = useState(false);
  const [B5, setB5] = useState(false); // Post-Matric SC/ST
  const [No, setNo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validations
    if (!name.trim()) return alert("Please enter your name");
    if (!num.trim()) return alert("Please enter your mobile number");
    if (!mail.trim()) return alert("Please enter your email");
    if (!marks10.trim()) return alert("Please enter your 10th percentage");
    if (!marks12.trim()) return alert("Please enter your 12th percentage");
    if (!income.trim()) return alert("Please enter your family income");
    if (!category.trim()) return alert("Please select your category");

    alert("Form submitted successfully!");
    setForm(false);

    const m10 = Number(marks10);
    const m12 = Number(marks12);
    const inc = Number(income);

    // --- Eligibility Logics ---

    // 1. MYSY – Gujarat (all categories)
    const eligibleForMYSY =
      (m12 >= 80 || m10 >= 80) && inc <= 600000;
    if (eligibleForMYSY) setB1(true);

    // 2. Digital Gujarat Scholarship (NOT for General)
    const eligibleForDigitalGujarat =
      (m12 >= 65 || m10 >= 65) && inc <= 2500000 && category !== "General";
    if (eligibleForDigitalGujarat) setB2(true);

    // 3. National Merit-cum-Means Scholarship (NMMS) (NOT for General)
    const eligibleForNMMS =
      m10 >= 55 && inc <= 150000 && category !== "General";
    if (eligibleForNMMS) setB3(true);

    // 4. AICTE/CBSE Merit Scholarship (open for all)
    const eligibleForAICTE =
      m12 >= 85 && inc <= 800000;
    if (eligibleForAICTE) setB4(true);

    // 5. Post-Matric Scholarship for SC/ST (only SC/ST)
    const eligibleForPostMatric =
      (category === "SC" || category === "ST") && inc <= 2500000;
    if (eligibleForPostMatric) setB5(true);

    if (
      !eligibleForMYSY &&
      !eligibleForDigitalGujarat &&
      !eligibleForNMMS &&
      !eligibleForAICTE &&
      !eligibleForPostMatric
    ) {
      setNo(true);
    }
  };

  return (
    <>
      <div>
        {HandleForm && (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name: </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label>Mobile Number: </label>
              <input
                type="tel"
                value={num}
                onChange={(e) => setNum(e.target.value)}
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label>Email: </label>
              <input
                type="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label>10th Marks (%): </label>
              <input
                type="number"
                value={marks10}
                onChange={(e) => setMarks10(e.target.value)}
                placeholder="Enter 10th %"
              />
            </div>

            <div>
              <label>12th Marks (%): </label>
              <input
                type="number"
                value={marks12}
                onChange={(e) => setMarks12(e.target.value)}
                placeholder="Enter 12th %"
              />
            </div>

            <div>
              <label>Family Annual Income (₹): </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter income"
              />
            </div>

            <div>
              <label>Category: </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <br />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>

      {/* Benefits Cards */}
      {B1 && (
        <div id="merit1">
          <h1>1. MYSY Scholarship (Mukhyamantri Yuva Swavalamban Yojana)</h1>
          <a href="https://mysy.guj.nic.in/">Click here to apply</a>
          <p>
            Gujarat government scholarship for students securing 80%+ in 10th/12th.  
            Provides tuition fee waiver and financial support.  
            Eligibility: Family income ≤ ₹6,00,000 (All categories).
          </p>
        </div>
      )}

      {B2 && (
        <div id="merit2">
          <h1>2. Digital Gujarat Scholarship</h1>
          <a href="https://www.digitalgujarat.gov.in/">Click here to apply</a>
          <p>
            For UG/PG students of Gujarat with 65%+ marks.  
            Available only for SC, ST, OBC, and EWS categories.  
            Family income ≤ ₹25 lakh.
          </p>
        </div>
      )}

      {B3 && (
        <div id="merit3">
          <h1>3. National Merit-cum-Means Scholarship (NMMS)</h1>
          <a href="https://scholarships.gov.in/">Click here to apply</a>
          <p>
            Central government scholarship for talented students from weaker sections.  
            Eligibility: 10th % ≥ 55%, income ≤ ₹1.5 lakh, only for SC/ST/OBC/EWS.
          </p>
        </div>
      )}

      {B4 && (
        <div id="merit4">
          <h1>4. AICTE/CBSE Merit Scholarship</h1>
          <a href="https://www.aicte-india.org/schemes/students-development-schemes">Click here to apply</a>
          <p>
            Merit scholarship for engineering/technical students.  
            Eligibility: 12th % ≥ 85%, income ≤ ₹8 lakh (all categories).
          </p>
        </div>
      )}

      {B5 && (
        <div id="merit5">
          <h1>5. Post-Matric Scholarship for SC/ST Students</h1>
          <a href="https://www.digitalgujarat.gov.in/">Click here to apply</a>
          <p>
            Scholarship for SC/ST students studying in post-matric classes (college/university).  
            Provides tuition fees, maintenance allowance, and other benefits.  
            Eligibility: Category SC/ST, income ≤ ₹2.5 lakh.
          </p>
        </div>
      )}

      {No && (
        <div id="meritNo">
          <h1>Sorry, you are not eligible for any benefits</h1>
          <img
            src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg"
            style={{ height: "400px" }}
            alt="no benefits"
          />
        </div>
      )}
    </>
  );
};

export default Merit;
