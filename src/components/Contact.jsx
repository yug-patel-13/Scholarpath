import React, { useEffect, useState } from 'react';
import './Contact.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation('global');
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [para, setPara] = useState("");

  const fetchdata = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feed');
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
       await axios.post('http://localhost:5000/api/feedback', {
        name,
        phone,
        email,
        comment
      });

      alert(t('contact.success'));
      setName("");
      setPhone("");
      setEmail("");
      setComment("");
      setPara(t('contact.success'));
      fetchdata();
    } catch (err) {
      alert(t('contact.error'));
    }
  };

  return (
    <div className="contact-container">
      <h1>{t('contact.title')}</h1>
 
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          placeholder={t('contact.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder={t('contact.phonePlaceholder')}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder={t('contact.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          placeholder={t('contact.messagePlaceholder')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="5"
          required
        />

        {para && <div className="success-message">{para}</div>}
        <button type="submit">{t('contact.send')}</button>
      </form>
    </div>
  );
};

export default Contact;
