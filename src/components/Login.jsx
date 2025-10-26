import React, {  useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom';
import "./Login.css"
import axios from 'axios'

const Login = ({setusername}) => {
  const [loginName, setLoginName] = useState('');
  const [passwordd, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('')


  const navigate=useNavigate()

  const reset = () => {
    setLoginName('');
    setPassword('');
    setErrorMsg('');
  };



  const handleSubmit =async() => {
  try{
   const res= await axios.post('http://localhost:5000/api/login',

      {
        email:loginName,
        password:passwordd,

      });
      if(res.data.success){
        alert("login succesfully")
        navigate("/")
        setusername("welcome-back")
      }
 else{
  alert("wrong credetial bata" )
 }
  }
  catch(err){
    setErrorMsg("wrong credential")
    console.log(err)
  }
  
  };




  return (
    <div  className="login-container">

      <h1 id="elegantHeadingg">welcome back</h1>
      <div>
        <h4>Name:</h4>
        <input
          type="text"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          placeholder="Enter your email"
          autoFocus
        />
      </div>

      <div>
        <h4>Password:</h4>
        <input
          type="password"
          value={passwordd}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      {errorMsg && <h6 style={{ color: 'red' }}>{errorMsg}</h6>}

      <div>
        <button  id='sub' onClick={handleSubmit} >Submit</button>
        <button  id="reset" onClick={reset}>Reset</button>
      </div>
      <Link to="/new">new user?click here</Link>
    </div>
  );
};

export default Login;
