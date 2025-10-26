import React, { useState } from 'react';

const Ews = () => {
  const [name, setName] = useState('');
  const [num, setNum] = useState('');
  const [mail, setMail] = useState('');
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [ewsCert, setEwsCert] = useState('');

  const [HandleForm, setForm] = useState(true);

  // Schemes states
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
    if (!ewsCert.trim()) return alert("Please select whether you have an EWS certificate");

    alert("Form submitted successfully!");
    setForm(false);

    const incomeNum = Number(income);
    const ageNum = Number(age);

    // Eligibility checks
    const eligibleForReservation =
      ewsCert === 'yes' && incomeNum <= 800000;

    if (eligibleForReservation) setB1(true);

    const eligibleForScholarship =
      ewsCert === 'yes' && incomeNum <= 250000 && ageNum <= 25;

    if (eligibleForScholarship) setB2(true);

    const eligibleForEducationLoan =
      ewsCert === 'yes' && incomeNum <= 600000;

    if (eligibleForEducationLoan) setB3(true);

    const eligibleForHealthScheme =
      ewsCert === 'yes' && incomeNum <= 500000;

    if (eligibleForHealthScheme) setB4(true);

    if (!eligibleForReservation && !eligibleForScholarship && !eligibleForEducationLoan && !eligibleForHealthScheme) {
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
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            </div>

            <div>
              <label>Mobile Number: </label>
              <input type="tel" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Enter your mobile number" />
            </div>

            <div>
              <label>Email: </label>
              <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Enter your email" />
            </div>

            <div>
              <label>Age: </label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter age" />
            </div>

            <div>
              <label>Annual Income (₹): </label>
              <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="Enter income" />
            </div>

            <div>
              <h4>Do you have a valid EWS Certificate?</h4>
              <input type="radio" name="ews" value="yes" onChange={(e) => setEwsCert(e.target.value)} /> Yes
              <input type="radio" name="ews" value="no" onChange={(e) => setEwsCert(e.target.value)} /> No
            </div>

            <br />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>

      {/* Benefits Cards */}
      <div className="benefits-container">
        {B1 && (
          <div id="ews1">
            <h1>1. 10% Reservation in Education & Jobs</h1>
            <a href="https://www.indiatoday.in/education-today/news/story/ews-quota-reservation-application-eligibility-documents-1429567-2019-01-11">
              Click here for official info
            </a>
            <p>
              Economically Weaker Section candidates get 10% reservation in higher education and government jobs.
            </p>
          </div>
        )}

        {B2 && (
          <div id="ews2">
            <h1>2. EWS Scholarship Schemes</h1>
            <a href="https://scholarships.gov.in/">Click here to apply</a>
            <p>
              Scholarships for EWS students from school to college levels.  
              Income must be below ₹2.5 lakh, age below 25 years.
            </p>
          </div>
        )}

        {B3 && (
          <div id="ews1">
            <h1>3. Education Loan Subsidy Scheme</h1>
            <a href="https://www.canarabank.com/user_page.aspx?othlink=391">Click here for details</a>
            <p>
              Interest subsidy on education loans for EWS students pursuing professional and technical courses.
            </p>
          </div>
        )}

        {B4 && (
          <div id="ews2">
            <h1>4. Ayushman Bharat – PMJAY</h1>
            <a href="https://pmjay.gov.in/">Click here to apply</a>
            <p>
              Health insurance of ₹5 lakh per family per year for EWS households.  
              Covers hospitalization and major treatments.
            </p>
          </div>
        )}

        {No && (
          <div className="no-benefits">
            <h1>Sorry, you are not eligible for any benefits</h1>
            <img
              src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg"
              style={{ height: "400px" }}
              alt="no benefits"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Ews;
