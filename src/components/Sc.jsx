import React, { useState } from 'react';
import './Sc.css';

const Sc = () => {
  const [name, setName] = useState('');
  const [num, setNum] = useState('');
  const [mail, setMail] = useState('');
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [caste, setCaste] = useState('');

  const [HandleForm, setForm] = useState(true);

  // Scheme visibility states
  const [B1, setB1] = useState(false);
  const [B2, setB2] = useState(false);
  const [B3, setB3] = useState(false);
  const [B4, setB4] = useState(false);
  const [No, setNo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!name.trim()) return alert("Please enter your name");
    if (!num.trim()) return alert("Please enter your mobile number");
    if (!mail.trim()) return alert("Please enter your email");
    if (!age.trim()) return alert("Please enter your age");
    if (!income.trim()) return alert("Please enter your annual income");
    if (!caste.trim()) return alert("Please select your caste");

    setForm(false);

    // Eligibility Logic
    const incomeNum = Number(income);
    const ageNum = Number(age);

    const eligibleForPostMatric =
      (caste === 'sc' || caste === 'st' || caste === 'obc') && incomeNum <= 250000;
    if (eligibleForPostMatric) setB1(true);

    const eligibleForScholarship =
      (caste === 'sc' || caste === 'st') && ageNum <= 25;
    if (eligibleForScholarship) setB2(true);

    const eligibleForSEBCLoan =
      (caste === 'obc' || caste === 'ebc') && incomeNum <= 1000000;
    if (eligibleForSEBCLoan) setB3(true);

    const eligibleForHostel =
      (caste === 'sc' || caste === 'st' || caste === 'obc') && ageNum <= 30;
    if (eligibleForHostel) setB4(true);

    if (!eligibleForPostMatric && !eligibleForScholarship && !eligibleForSEBCLoan && !eligibleForHostel) {
      setNo(true);
    }
  };

  return (
    <>
      <div id="sc-container">
        {HandleForm && (
          <form id="sc-form" onSubmit={handleSubmit}>
            <h2 className="form-title">SC / ST / OBC / EBC Benefits Form</h2>

            <div className="form-group">
              <label htmlFor="sc-name">Name</label>
              <input id="sc-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            </div>

            <div className="form-group">
              <label htmlFor="sc-num">Mobile Number</label>
              <input id="sc-num" type="tel" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Enter your mobile number" />
            </div>

            <div className="form-group">
              <label htmlFor="sc-mail">Email</label>
              <input id="sc-mail" type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label htmlFor="sc-age">Age</label>
              <input id="sc-age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter age" />
            </div>

            <div className="form-group">
              <label htmlFor="sc-income">Annual Income (₹)</label>
              <input id="sc-income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="Enter income" />
            </div>

            <div className="form-radio">
              <h4>Select your caste category</h4>
              <input type="radio" id="caste-sc" name="caste" value="sc" onChange={(e) => setCaste(e.target.value)} /> <label htmlFor="caste-sc">SC</label>
              <input type="radio" id="caste-st" name="caste" value="st" onChange={(e) => setCaste(e.target.value)} /> <label htmlFor="caste-st">ST</label>
              <input type="radio" id="caste-obc" name="caste" value="obc" onChange={(e) => setCaste(e.target.value)} /> <label htmlFor="caste-obc">OBC</label>
              <input type="radio" id="caste-ebc" name="caste" value="ebc" onChange={(e) => setCaste(e.target.value)} /> <label htmlFor="caste-ebc">EBC</label>
            </div>

            <button id="sc-submit-btn" type="submit">Submit</button>
          </form>
        )}
      </div>

      {/* Benefits */}
      <div id="sc-benefits">
        {B1 && (
          <div className="benefit-card" id="sc-benefit-1">
            <h1>1. Post-Matric Scholarship</h1>
            <a href="https://scholarships.gov.in/">Official Link</a>
            <p>Financial help for SC/ST/OBC students with income below ₹2.5 lakh.</p>
          </div>
        )}

        {B2 && (
          <div className="benefit-card" id="sc-benefit-2">
            <h1>2. Pre-Matric Scholarship</h1>
            <a href="https://scholarships.gov.in/">Official Link</a>
            <p>Support for SC/ST students up to 10th standard. Age below 25 years.</p>
          </div>
        )}

        {B3 && (
          <div className="benefit-card" id="sc-benefit-3">
            <h1>3. OBC/EBC Loan Scheme</h1>
            <a href="https://nsfdc.nic.in/">Official Link</a>
            <p>Loans for OBC/EBC families to support education & business. Income ≤ ₹10 lakh.</p>
          </div>
        )}

        {B4 && (
          <div className="benefit-card" id="sc-benefit-4">
            <h1>4. Hostel Facilities Scheme</h1>
            <a href="https://socialjustice.nic.in/">Official Link</a>
            <p>Free/low-cost hostel facilities for SC/ST/OBC students. Age ≤ 30 years.</p>
          </div>
        )}

        {No && (
          <div className="benefit-card no-benefit">
            <h1>Sorry, you are not eligible for any benefits</h1>
            <img
              src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg"
              alt="no benefits"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Sc;
