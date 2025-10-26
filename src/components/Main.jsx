import React, { useState } from 'react'
import "./Main.css"
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const Main = ({username}) => {
  const [Active, setActive] = useState("home")

    const [t, i18n] = useTranslation("global");

  const handlang = (lang) => {
  i18n.changeLanguage(lang);
};

  const handleAct = (Linkname) => {
    setActive(Linkname)
  }

  return (
    <>
      <div id='navbar'>

        <div id='image'><img src="scoimg.png" alt="logo" id='img' /></div>
        <div> <p style={{color:"white"}}>Choose your language : </p>
         <select name="language" id="lang" onChange={(e) => handlang(e.target.value)}>
  <option value="en">English</option>
  <option value="guj">Gujarati</option>
  <option value="hn">Hindi</option>
</select>
</div> 
        <div id='links'>
       
          <div ><Link to="/" id='link' onClick={() => handleAct('home')} style={Active !== "home" ? { color: 'white' } : { color: 'yellow' }} >Home</Link></div>
          <div><Link to="/about" id='link' onClick={() => handleAct('about')} style={Active !== "about" ? { color: 'white' } : { color: 'yellow' }}>About-us</Link></div>
          <div><Link to="/contact" id='link' onClick={() => handleAct('contact')} style={Active !== "contact" ? { color: 'white' } : { color: 'yellow' }}>Contact Us</Link></div>
          <div><Link to="/faq" id='link' onClick={() => handleAct('faq')} style={Active !== "faq" ? { color: 'white' } : { color: 'yellow' }}>FAQ</Link></div>
          <div> <Link to="/Login" id='link' title='click here to login' onClick={() => handleAct('Login')} style={Active !== "Login" ? { color: 'white' } : { color: 'yellow' }}>
          <button id='lgn'>{username}</button></Link></div>
        </div>

      </div>

    </>
  )
}

export default Main
