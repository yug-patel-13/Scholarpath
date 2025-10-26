import React, { useState } from "react";
import "./Chat.css";


const presetFAQs = [
  {
    q: "What is this website for?",
    a:
      "Government declared so many scholarships, but we are not aware of them. We are helping people get their benefit."
  },
  {
    q: "How to use this website?",
    a: "First click on your category."
  },
  {
    q: "Can we use without login?",
    a: "No, you cannot. We need to know who is using our website."
  },
  {
    q: "Is this 100% accurate?",
    a: "Yes, until government stops or changes their criteria."
  },
  {
    q: "All information is secure to enter?",
    a: "Yes, your information security is our first priority."
  }
];


export default function Chat() {

  const [messages, setMessages] = useState([]);


  const [input, setInput] = useState("");



  const handleFAQClick = (index) => {
    const { q, a } = presetFAQs[index];

    setMessages((prev) => [
      ...prev,
      { type: "question", text: q },
      
    ]);
    setInput("");
    setTimeout(()=>{
  setMessages((prev)=>[
    ...prev,
  { type: "answer", text: a }
  ]

  )
},500)
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return; 

    const idx = presetFAQs.findIndex((item, i) => {
      const byNumber = String(i + 1) === trimmed; // by number
      const byText = item.q.toLowerCase() === trimmed.toLowerCase();// yug says=> it will convert toLowercase(coputer understand) trimmed means if space the also valid
      return byNumber || byText;
    });

    if (idx !== -1) {

      handleFAQClick(idx);
    } else {
     
      setMessages((prev) => [
        ...prev,
        { type: "question", text: trimmed },
       ]);
setTimeout(()=>{
  setMessages((prev)=>[
    ...prev,
    { type: "answer", text: "Sorry, I don't understand yet.",}
  ]

  )
},500)
      
    }
    
  };


  return (
    <div id="handlebot">
      <img src="chatbot.png" alt="robot" style={{height:"100px", width:"100px"}} id="chatbotphoto"/>
      <div id="chating">
        <div id="margans">
          
          <div id="ques">
            {presetFAQs.map((item, idx) => (
              <div key={idx} className="wide">
                <button className="widthm" onClick={() => handleFAQClick(idx)}>
                  {item.q}
                </button>
              </div>
            ))}
          </div>

        
          <div id="thread">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.type === "question" ? "wide" : "wide2"}
              >
                <button
                  className={msg.type === "question" ? "widthm" : "widthm2"}
                >
                  {msg.text}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="chathan">
        <input
          type="text"
          placeholder="enter your question number or text here"
          id="chatinput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button id="btnchat" onClick={handleSend}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}
