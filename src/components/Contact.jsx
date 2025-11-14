import React, { useEffect, useState } from 'react';
import './Contact.css';
import axios from 'axios';

const Contact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [para, setPara] = useState("");

  const fetchdata = async () => {
    try {
      const res = await axios.get('http://localhost:7000/api/feed');
      console.log(res.data); // optional
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       await axios.post('http://localhost:7000/api/feedback', {
        name,
        phone,
        email,
        comment
      });

      alert("Thank you for your feedback!");
      setName("");
      setPhone("");
      setEmail("");
      setComment("");
      setPara("We will contact you soon. Thank you!");
      fetchdata();
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          placeholder="Your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your comment or feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="5"
          required
        />

        {para && <div className="success-message">{para}</div>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Contact;
