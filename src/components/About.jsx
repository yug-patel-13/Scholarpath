import React from 'react';
import './About.css';
import { useTranslation } from 'react-i18next';

const About = () => {
    const [t] = useTranslation("global");

  return (
    <div className="about-container">
      <section className="about-hero">
       <h1>{t("about.hero.title")}</h1>
<p className="fade-in">{t("about.hero.description")}</p>

<h2>{t("about.mission.title")}</h2>
<p>{t("about.mission.description")}</p>

<h2>{t("about.features.title")}</h2>


{t("about.features.list.0")}
<br />
{t("about.features.list.1")}
<br />
{t("about.features.list.2")}
<br />
{t("about.features.list.3")}


      </section>
    </div>
  );
};

export default About;
