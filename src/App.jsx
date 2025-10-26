import React, { useState } from 'react'
import Login from './components/Login'
import Main from './components/Main'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Createacc from './components/Createacc'
import "./App.css"
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import Faq from './components/Faq'
import Farmer from './components/Farmer'
import ShareView from './components/ShareView'
import Chat from './components/Chat'
import Woman from './components/Woman'
import Sc from './components/Sc'
import Ews from './components/Ews'
import Merit from './components/Merit'



const App = () => {

  const [username,setusername]=useState("Login")
  const [show,setshow]=useState(true)

  const showing=()=>{
    setshow(false)
  }

  return (
    <>
    {show && (
    <div id='welcombannerc'>
         
    <div id="welcomebanner">
 
<img src="scoimg.png" alt="logo" id='logomy'/>
<h2>welcome , We hope your best</h2>
<h1 style={{color:"red"}}>You need to Login to get your benefits</h1>
  <button onClick={showing} id='band' >Close</button>

    </div>
    </div>
    )}
    <div>
          <Router>
  <Main username={username} setusername={setusername}/>
  
        <Routes>
          <Route path='/' exact element={<Home username={username}/>}/>
          <Route path='/Login' element={<Login setusername={setusername}/>} />
     <Route path='/about' element={<About/>}/>
      <Route path="/new" element={<Createacc setusername={setusername}/>} />
      <Route path="/contact" element={<Contact/>}/>
      <Route path='/faq' element={<Faq/>}/>
      <Route path='/farmer' element={<Farmer/>}/>
  <Route path='/share/:token' element={<ShareView/>} />
      <Route path='/sc' element={<Sc/>}/>
      <Route path='/woman' element={<Woman/>}/>
      <Route path='/ews' element={<Ews/>}/>

    <Route path='/merit' element={<Merit/>}/>

         
      <Route path='/chatbot' element={<Chat/>}/>
     

   
      </Routes>
      </Router>
      
    </div>
    <div id='footer'>
    <footer>
        <div className="footer-container">
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com/about_art_13/" target="_blank" rel="noopener noreferrer" title="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/in/yug-patel-58112325b/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="mailto:yugpatelart@gmail.com" title="Email Us">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
          <div className="footer-email">
            <p>Contact us: yugpatelart@gmail.com</p>
          </div>
          <div className="footer-rights">
            <p>© 2025 scholarpath. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
    </>
  )
}

export default App
