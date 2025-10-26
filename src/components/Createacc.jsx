import React, { useEffect, useState } from 'react'
import "./Createacc.css"
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const Createacc = ({setusername}) => {
  const [creatName,setcreateName]=useState("")
  const [creatEmail,setcreateEmail]=useState("")
  const [creatPass,setcreatePass]=useState("")
  const [para,setPara]=useState("")

  const fetchdata=async()=>{
    try{
      await axios.get('http://localhost:5000/api/user');
      
    }
    catch(err){
      console.log(err);
    }

  }
  useEffect(()=>{
fetchdata()
  },[])
  
  const navigate=useNavigate()

  const subtn=async()=>{
 
    if(!creatName){
      setPara("enter the name")
      return;
    }
    if(!creatEmail){
      setPara("enter the email")
      return;
    }
    if(!creatPass || creatPass.length<8 || creatPass.length>8){
      setPara("enter the 8 digit password")
      return;
    }
    else{
      alert("account created successfully")
      setusername("welocome-"+creatName)
      navigate('/')
    }

try{
  await axios.post('http://localhost:5000/api/user',{name:creatName,email:creatEmail,password:creatPass})
  setcreateName("")
  setcreateEmail("")
  setcreatePass("")
  fetchdata()
}
catch(err){

  alert(err+"during the stor data")
}

  }
  const resetbtn=()=>{
    setcreateEmail("")
    setcreateName("")
    setcreatePass("")
    setPara("")
  }
   return (
    <>
    
    <div id='createacc'>
   
      <h1 id="elegantHeading">welcome</h1>
      <h6 id='para' style={{color:"red",transition:"2s"}}>{para} </h6>
      <div id="crname">

<input type="text" id='name' value={creatName} onChange={(e)=>setcreateName(e.target.value)} placeholder='enter the name' autoFocus/>
      </div>
     
      <div id="cremail">
    
      <input type="email" id='email' value={creatEmail} onChange={(e)=>setcreateEmail(e.target.value)} placeholder='enter the email'/>
      </div>
      <div id="crpass">
       
<input type="password" id='password' value={creatPass} onChange={(e)=>setcreatePass(e.target.value)} placeholder='enter the 8 digit password'/>
      </div>
      <div id="crbtn">
<button onClick={subtn} id='subtn'>Submit</button>
<button onClick={resetbtn} id='resbtn'>Reset</button>

      </div>
      
    </div>
    </>
  )
}

export default Createacc
