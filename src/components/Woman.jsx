import React, { useState } from 'react';
import './Woman.css';

const Woman = () => {
  const [Wname, setWname] = useState('');
  const [Wnum, setWnum] = useState('');
  const [Wmail, setWmail] = useState('');
  const [Wage, setWage] = useState('');
  const [Wincome, setWincome] = useState('');

  const [HandleForm, setForm] = useState(true);

  const [HandleB1, setB1] = useState(false);
  const [HandleB2, setB2] = useState(false);
  const [HandleB3, setB3] = useState(false);
  const [HandleB4, setB4] = useState(false);
  const [HandleB5, setB5] = useState(false);
  const [HandleNo, setNo] = useState(false);

  // Radio states
  const [isWidow, setIsWidow] = useState('');
  const [isPregnant, setIsPregnant] = useState('');
  const [isStudent, setIsStudent] = useState('');
  const [hasBank, setHasBank] = useState('');
  const [isWorking, setIsWorking] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Wname.trim()) return alert("Please enter your name");
    if (!Wnum.trim()) return alert("Please enter your mobile number");
    if (!Wmail.trim()) return alert("Please enter your email");
    if (!Wage.trim()) return alert("Please enter your age");
    if (!Wincome.trim()) return alert("Please enter your annual income");
    if (!isWidow) return alert("Please select widow status");
    if (!isPregnant) return alert("Please select pregnancy status");
    if (!isStudent) return alert("Please select student status");
    if (!hasBank) return alert("Please select bank account status");
    if (!isWorking) return alert("Please select working status");

    setForm(false);

    const eligibleForPMMVY = isPregnant === 'yes' && hasBank === 'yes';
    if (eligibleForPMMVY) setB1(true);

    const eligibleForWidowPension = isWidow === 'yes' && Wincome <= 120000;
    if (eligibleForWidowPension) setB2(true);

    const eligibleForBetiBachao = isStudent === 'yes' && Number(Wage) <= 18;
    if (eligibleForBetiBachao) setB3(true);

    const eligibleForStandUp = isWorking === 'yes' && hasBank === 'yes';
    if (eligibleForStandUp) setB4(true);

    const eligibleForJananiSuraksha = isPregnant === 'yes' && hasBank === 'yes';
    if (eligibleForJananiSuraksha) setB5(true);

    if (!eligibleForPMMVY && !eligibleForWidowPension && !eligibleForBetiBachao && !eligibleForStandUp && !eligibleForJananiSuraksha) {
      setNo(true);
    }
  };

  return (
    <>
      <div id="woman-container">
        {HandleForm && (
          <form id="woman-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Women Benefits Form</h2>

            <div className="form-group">
              <label htmlFor="w-name">Name</label>
              <input id="w-name" type="text" value={Wname} onChange={(e) => setWname(e.target.value)} placeholder="Enter your name" />
            </div>

            <div className="form-group">
              <label htmlFor="w-num">Mobile Number</label>
              <input id="w-num" type="tel" value={Wnum} onChange={(e) => setWnum(e.target.value)} placeholder="Enter your mobile number" />
            </div>

            <div className="form-group">
              <label htmlFor="w-mail">Email</label>
              <input id="w-mail" type="email" value={Wmail} onChange={(e) => setWmail(e.target.value)} placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label htmlFor="w-age">Age</label>
              <input id="w-age" type="number" value={Wage} onChange={(e) => setWage(e.target.value)} placeholder="Enter age" />
            </div>

            <div className="form-group">
              <label htmlFor="w-income">Annual Income (₹)</label>
              <input id="w-income" type="number" value={Wincome} onChange={(e) => setWincome(e.target.value)} placeholder="Enter income" />
            </div>

            <div className="form-radio">
              <h4>Are you a widow?</h4>
              <input type="radio" id="widow-yes" name="widow" value="yes" onChange={(e) => setIsWidow(e.target.value)} /> <label htmlFor="widow-yes">Yes</label>
              <input type="radio" id="widow-no" name="widow" value="no" onChange={(e) => setIsWidow(e.target.value)} /> <label htmlFor="widow-no">No</label>

              <h4>Are you pregnant?</h4>
              <input type="radio" id="preg-yes" name="pregnant" value="yes" onChange={(e) => setIsPregnant(e.target.value)} /> <label htmlFor="preg-yes">Yes</label>
              <input type="radio" id="preg-no" name="pregnant" value="no" onChange={(e) => setIsPregnant(e.target.value)} /> <label htmlFor="preg-no">No</label>

              <h4>Are you a student?</h4>
              <input type="radio" id="stud-yes" name="student" value="yes" onChange={(e) => setIsStudent(e.target.value)} /> <label htmlFor="stud-yes">Yes</label>
              <input type="radio" id="stud-no" name="student" value="no" onChange={(e) => setIsStudent(e.target.value)} /> <label htmlFor="stud-no">No</label>

              <h4>Do you have a bank account?</h4>
              <input type="radio" id="bank-yes" name="bank" value="yes" onChange={(e) => setHasBank(e.target.value)} /> <label htmlFor="bank-yes">Yes</label>
              <input type="radio" id="bank-no" name="bank" value="no" onChange={(e) => setHasBank(e.target.value)} /> <label htmlFor="bank-no">No</label>

              <h4>Are you working/self-employed?</h4>
              <input type="radio" id="work-yes" name="working" value="yes" onChange={(e) => setIsWorking(e.target.value)} /> <label htmlFor="work-yes">Yes</label>
              <input type="radio" id="work-no" name="working" value="no" onChange={(e) => setIsWorking(e.target.value)} /> <label htmlFor="work-no">No</label>
            </div>

            <button id="submit-btn" type="submit">Submit</button>
          </form>
        )}
      </div>

      {/* Benefits */}
      <div id="benefits-container">
        {HandleB1 && (
          <div className="benefit-card" id="benefit-1">
            <h1>1. Pradhan Mantri Matru Vandana Yojana (PMMVY)</h1>
            <a href="https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana">Official Link</a>
            <p>₹5,000 for pregnant and lactating women for the first child.</p>
          </div>
        )}

        {HandleB2 && (
          <div className="benefit-card" id="benefit-2">
            <h1>2. Widow Pension Scheme</h1>
            <a href="https://nsap.nic.in/">Official Link</a>
            <p>Monthly pension support for widows under poverty line.</p>
          </div>
        )}

        {HandleB3 && (
          <div className="benefit-card" id="benefit-3">
            <h1>3. Beti Bachao Beti Padhao</h1>
            <a href="https://wcd.nic.in/bbbp-schemes">Official Link</a>
            <p>Scholarships and education support for girl children.</p>
          </div>
        )}

        {HandleB4 && (
          <div className="benefit-card" id="benefit-4">
            <h1>4. Stand-Up India Scheme</h1>
            <a href="https://www.standupmitra.in/">Official Link</a>
            <p>Loans between ₹10 lakh – ₹1 crore for women entrepreneurs.</p>
          </div>
        )}

        {HandleB5 && (
          <div className="benefit-card" id="benefit-5">
            <h1>5. Janani Suraksha Yojana (JSY)</h1>
            <a href="https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309">Official Link</a>
            <p>Cash incentive to promote institutional deliveries.</p>
          </div>
        )}

        {HandleNo && (
          <div className="benefit-card no-benefit">
            <h1>Sorry, you are not eligible for any benefits</h1>
            <img src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg" alt="no benefits" />
          </div>
        )}
      </div>
    </>
  );
};

export default Woman;
