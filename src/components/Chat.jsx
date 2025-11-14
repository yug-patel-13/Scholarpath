import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

// Comprehensive knowledge base about the website
const knowledgeBase = [
  {
    keywords: ["what is", "website", "purpose", "about", "scholarpath"],
    question: "What is this website for?",
    answer: "ScholarPath is a platform that helps you discover government scholarships and benefits you're eligible for. We bridge the gap between government-declared scholarships and people who need them. Our mission is to help students, farmers, women, and economically weaker sections get the financial aid they deserve."
  },
  {
    keywords: ["how to use", "how do i", "steps", "process", "guide", "tutorial"],
    question: "How to use this website?",
    answer: "Here's how to use ScholarPath:\n\n1. **Create Account**: Sign up for free and create your profile\n2. **Select Category**: Choose from Farmer, SC/ST/OBC, Merit Based, Women, or EWS\n3. **Fill Details**: Provide your information for accurate eligibility checking\n4. **Get Results**: View eligible scholarships with complete details\n5. **Apply & Track**: Apply for scholarships and track your progress\n\nYou need to login first to access the category forms."
  },
  {
    keywords: ["login", "sign in", "account", "register", "signup", "without login", "no login"],
    question: "Can we use without login?",
    answer: "No, you cannot use the full features without logging in. We need to know who is using our website to provide personalized scholarship matching. However, you can browse the homepage and learn about our platform. To access category forms and find your eligible scholarships, you must create a free account and login."
  },
  {
    keywords: ["accurate", "accuracy", "correct", "reliable", "trust", "verify", "100%"],
    question: "Is this 100% accurate?",
    answer: "Yes, our information is accurate and regularly updated. We maintain government-verified data and update it whenever the government changes criteria or stops programs. However, scholarship availability depends on government policies, so we recommend checking official government websites for the most current status before applying."
  },
  {
    keywords: ["secure", "security", "safe", "privacy", "data", "information", "personal"],
    question: "All information is secure to enter?",
    answer: "Yes, your information security is our first priority. We use secure encryption methods to protect your personal data. We only collect necessary information to match you with eligible scholarships, and we never share your data with third parties without your consent."
  },
  {
    keywords: ["categories", "category", "types", "farmer", "sc", "st", "obc", "women", "ews", "merit"],
    question: "What categories are available?",
    answer: "We offer 5 main categories:\n\n👨‍🌾 **Farmer**: Benefits and scholarships for farmers and their children\n📜 **SC/ST/OBC**: Scholarships for Scheduled Castes, Scheduled Tribes, and Other Backward Classes\n🎓 **Merit Based**: Merit-based scholarships & CMSS (Chief Minister Scholarship Scheme) for all students\n👩 **Women**: Scholarships specifically designed for women students\n💰 **EWS**: Economically Weaker Section scholarships and benefits\n\nClick on any category after logging in to find eligible scholarships."
  },
  {
    keywords: ["features", "what we offer", "services", "benefits", "offerings"],
    question: "What features does this website offer?",
    answer: "ScholarPath offers:\n\n🎯 **Accurate Eligibility Matching**: See only scholarships you're eligible for\n📋 **Step-by-Step Guidance**: Detailed instructions and document checklists\n📄 **PDF Downloads**: Download complete information packages\n📍 **Cyber Cafe Locator**: Find nearest cyber cafes for applications\n💬 **Form Fill Service**: Get help via WhatsApp or offline service\n✅ **Progress Tracking**: Track your application progress\n\nAll features are 100% free to use!"
  },
  {
    keywords: ["scholarships", "how many", "available", "count", "number"],
    question: "How many scholarships are available?",
    answer: "We have 100+ scholarships available across all categories. These include government-declared scholarships for farmers, SC/ST/OBC students, women, EWS category, and merit-based students. The number may vary as government policies change."
  },
  {
    keywords: ["free", "cost", "price", "charge", "payment", "money"],
    question: "Is this platform free to use?",
    answer: "Yes, ScholarPath is 100% free to use! You can search and explore all available scholarships, download PDFs, get step-by-step guidance, and use all features without any charges. We believe financial aid information should be accessible to everyone."
  },
  {
    keywords: ["apply", "application", "how to apply", "process", "steps to apply"],
    question: "How do I apply for scholarships?",
    answer: "To apply for scholarships:\n\n1. **Login** to your account\n2. **Select your category** (Farmer, SC/ST/OBC, Women, EWS, or Merit)\n3. **Fill the form** with your details\n4. **View eligible scholarships** that match your profile\n5. **Follow step-by-step instructions** for each scholarship\n6. **Download required documents** and forms\n7. **Submit applications** as per guidelines\n8. **Track your progress** on the platform\n\nWe provide detailed instructions for each scholarship application."
  },
  {
    keywords: ["documents", "required", "papers", "what do i need", "documents needed"],
    question: "What documents do I need?",
    answer: "Required documents vary by scholarship, but commonly include:\n\n• Identity proof (Aadhaar, PAN, etc.)\n• Educational certificates\n• Income certificate\n• Caste certificate (if applicable)\n• Bank account details\n• Passport size photos\n• Domicile certificate\n\nEach scholarship page provides a complete document checklist. You can also download PDF guides with all requirements."
  },
  {
    keywords: ["contact", "help", "support", "email", "phone", "reach", "get in touch"],
    question: "How can I contact support?",
    answer: "You can reach us through:\n\n📧 **Email**: yugpatelart@gmail.com\n💬 **Support**: We're here to help 24/7\n🌐 **Social Media**: Follow us on social platforms\n\nYou can also visit the Contact page or FAQ section for more information. For form filling assistance, use our Form Fill Service available on the platform."
  },
  {
    keywords: ["form fill", "help with form", "assistance", "whatsapp", "offline"],
    question: "What is the Form Fill Service?",
    answer: "Our Form Fill Service helps you complete scholarship applications:\n\n💬 **Online Help**: Get assistance via WhatsApp\n🏠 **Offline Service**: Book doorstep assistance\n\nThis service is designed to help those who need guidance filling out complex application forms. You can request help through the Form Fill Request page after logging in."
  },
  {
    keywords: ["cyber cafe", "location", "find", "nearby", "where"],
    question: "How do I find cyber cafes?",
    answer: "We have a Cyber Cafe Locator feature that helps you find the nearest cyber cafes to complete your scholarship applications. This is especially useful if you need internet access or computer facilities to submit online applications. The locator is available in the platform features."
  },
  {
    keywords: ["eligibility", "eligible", "qualify", "criteria", "requirements"],
    question: "How do I know if I'm eligible?",
    answer: "After logging in and selecting your category, fill out the form with your details. Our system will automatically match you with scholarships you're eligible for based on:\n\n• Your category (Farmer, SC/ST/OBC, Women, EWS, Merit)\n• Income level\n• Educational qualifications\n• Age requirements\n• Other specific criteria\n\nYou'll only see scholarships that match your profile, saving you time and effort."
  }
];

// Fuzzy string matching function (Levenshtein distance)
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

// Calculate similarity score (0-1)
function similarity(str1, str2) {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLen;
}

// Find best matching answer
function findBestMatch(userInput) {
  const normalizedInput = userInput.toLowerCase().trim();
  
  // Remove common words for better matching
  const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
  const words = normalizedInput.split(/\s+/).filter(word => word.length > 2 && !stopWords.includes(word));
  
  let bestMatch = null;
  let bestScore = 0;
  
  // First, try exact keyword matching
  for (const item of knowledgeBase) {
    let score = 0;
    let matchedKeywords = 0;
    
    for (const keyword of item.keywords) {
      // Check if keyword appears in input
      if (normalizedInput.includes(keyword.toLowerCase())) {
        score += 2;
        matchedKeywords++;
      }
      
      // Check fuzzy match for each word
      for (const word of words) {
        const sim = similarity(word, keyword.toLowerCase());
        if (sim > 0.7) {
          score += sim;
          matchedKeywords++;
        }
      }
    }
    
    // Also check similarity with the question itself
    const questionSim = similarity(normalizedInput, item.question.toLowerCase());
    score += questionSim * 1.5;
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }
  
  // If we have a reasonable match (score > 1), return it
  if (bestScore > 1) {
    return bestMatch;
  }
  
  // Fallback: check if input is a number (for FAQ selection)
  const numMatch = parseInt(normalizedInput);
  if (!isNaN(numMatch) && numMatch > 0 && numMatch <= knowledgeBase.length) {
    return knowledgeBase[numMatch - 1];
  }
  
  return null;
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFAQClick = (index) => {
    const item = knowledgeBase[index];
    if (!item) return;

    setMessages((prev) => [
      ...prev,
      { type: "question", text: item.question },
    ]);
    setInput("");
    
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "answer", text: item.answer },
      ]);
      setIsTyping(false);
    }, 500);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { type: "question", text: trimmed },
    ]);
    setInput("");

    // Find best match
    setIsTyping(true);
    setTimeout(() => {
      const match = findBestMatch(trimmed);
      
      if (match) {
        setMessages((prev) => [
          ...prev,
          { type: "answer", text: match.answer },
        ]);
      } else {
        // Provide helpful fallback response
        setMessages((prev) => [
          ...prev,
          {
            type: "answer",
            text: "I'm not sure I understood that. Here are some things I can help you with:\n\n• What is this website for?\n• How to use this website?\n• Categories available\n• Features and services\n• How to apply for scholarships\n• Document requirements\n• Contact and support\n\nTry asking about any of these topics, or click on the questions above for quick answers!",
          },
        ]);
      }
      setIsTyping(false);
    }, 800);
  };

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Close on Escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    document.body.classList.add('chatbot-open');
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('chatbot-open');
    };
  }, [handleClose]);

  return (
    <div className="chatbot-modal-overlay" onClick={handleClose}>
      <div className="chatbot-modal-container" onClick={(e) => e.stopPropagation()}>
        <div id="handlebot">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <img
                src="chatbot.png"
                alt="robot"
                className="chatbot-logo"
              />
              <div className="chatbot-title-section">
                <h2>ScholarPath Assistant</h2>
                <p>Ask me anything about scholarships!</p>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={handleClose} aria-label="Close chatbot">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div id="chating" ref={chatContainerRef}>
        <div id="margans">
          {messages.length === 0 && (
            <div id="ques">
              <div className="welcome-message">
                <h3>👋 Welcome to ScholarPath Chatbot!</h3>
                <p>I can help you with questions about:</p>
                <ul>
                  <li>Website features and services</li>
                  <li>Scholarship categories</li>
                  <li>How to apply</li>
                  <li>Document requirements</li>
                  <li>And much more!</li>
                </ul>
                <p className="hint-text">💡 Tip: You can type naturally - I understand typos and variations!</p>
              </div>
              {knowledgeBase.slice(0, 6).map((item, idx) => (
                <div key={idx} className="wide">
                  <button className="widthm" onClick={() => handleFAQClick(idx)}>
                    {item.question}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div id="thread">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.type === "question" ? "wide" : "wide2"}
              >
                <div
                  className={msg.type === "question" ? "widthm" : "widthm2"}
                >
                  {msg.type === "answer" ? (
                    <div className="answer-content">
                      {msg.text.split('\n').map((line, i) => {
                        // Format bold text
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <div key={i} style={{ marginBottom: i < line.split('\n').length - 1 ? '8px' : '0' }}>
                            {parts.map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j}>{part.slice(2, -2)}</strong>;
                              }
                              return <span key={j}>{part}</span>;
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="wide2">
                <div className="widthm2 typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
          </div>

          <div id="chathan">
            <input
              type="text"
              placeholder="Ask me anything about ScholarPath..."
              id="chatinput"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button id="btnchat" onClick={handleSend} disabled={isTyping}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
