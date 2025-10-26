import React, { useState } from 'react' 
import "./Main.css"
import { Link } from 'react-router-dom'
import About from "./About"
import { useTranslation } from 'react-i18next';

const Home = ({username}) => {
  const [chat, setchat] = useState(false);
  const [t] = useTranslation("global");

  const chatbot = () => {
    setchat(true)
  }
  const chatbot2 = () => {
    setchat(false)
  }

  return (
    <>
      <div>
        <div id='category'>

          <div id='containh1'><h1>{t("home.hero.title")}</h1></div>

          <div id='abc'>
            {/* Farmer */}
            {username === "Login" ? (
              <div id="cat" style={{ pointerEvents: "none", opacity: 0.5 }} >
                <img src="farmer.jpg" alt="farmer" id="photo1" />
                <h1 id="text">{t("home.categories.farmer")}</h1>
              </div>
            ) : (
              <Link to="/farmer">
                <div id="cat">
                  <img src="farmer.jpg" alt="farmer" id="photo1" />
                  <h1 id="text">{t("home.categories.farmer")}</h1>
                </div>
              </Link>
            )}

            {/* SC */}
            {username === "Login" ? (
              <div id="cat" style={{ pointerEvents: "none", opacity: 0.5 }}>
                <img src="sc.jpg" alt="sc" id='photo2' />
                <h1 id='text'>{t("home.categories.sc")}</h1>
              </div>
            ) : (
              <Link to="/sc">
                <div id="cat"><img src="sc.jpg" alt="sc" id='photo2' /><h1 id='text'>{t("home.categories.sc")}</h1></div>
              </Link>
            )}

            {/* Woman */}
            {username === "Login" ? (
              <div id="cat" style={{ pointerEvents: "none", opacity: 0.5 }}>
                <img src="woman.jpg" alt="woman" id='photo3' />
                <h1 id='text'>{t("home.categories.women")}</h1>
              </div>
            ) : (
              <Link to="/woman">
                <div id="cat"><img src="woman.jpg" alt="woman" id='photo3' /><h1 id='text'>{t("home.categories.women")}</h1></div>
              </Link>
            )}

            {/* EWS */}
            {username === "Login" ? (
              <div id="cat" style={{ pointerEvents: "none", opacity: 0.5 }}>
                <img src="ews.jpg" alt="ews" id='photo4' />
                <h1 id='text'>{t("home.categories.ews")}</h1>
              </div>
            ) : (
              <Link to="/ews">
                <div id="cat"><img src="ews.jpg" alt="ews" id='photo4' /><h1 id='text'>{t("home.categories.ews")}</h1></div>
              </Link>
            )}

            {/* Merit */}
            {username === "Login" ? (
              <div id="cat" style={{ pointerEvents: "none", opacity: 0.5 }}>
                <img src="merit.webp" alt="merit" id='photo5' />
                <h1 id='text'>{t("home.categories.merit")}</h1>
              </div>
            ) : (
              <Link to="/merit">
                <div id="cat"><img src="merit.webp" alt="merit" id='photo5' /><h1 id='text'>{t("home.categories.merit")}</h1></div>
              </Link>
            )}
          </div>

          <div>
            <About />
          </div>

          <section id="benefits">
            <h2>{t("home.benefits.title")}</h2>
            <ul>
              <li>{t("home.benefits.list.0")}</li>
              <li>{t("home.benefits.list.1")}</li>
              <li>{t("home.benefits.list.2")}</li>
              <li>{t("home.benefits.list.3")}</li>
            </ul>
          </section>

        </div>
      </div>

      <Link to='/chatbot' id='chat' onMouseEnter={chatbot} onMouseLeave={chatbot2}>
        <div id="chatbot">
          <img src="chatbot.png" alt="" style={{ height: '100px', width: '100px' }} />
          {chat && (<h1 id='bot'>{t("home.chatbot.message")}</h1>)}
        </div>
      </Link>
    </>
  )
}

export default Home
