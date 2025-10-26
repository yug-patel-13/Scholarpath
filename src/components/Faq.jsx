import React from "react";
import { useTranslation } from "react-i18next";
import "./Faq.css";

const Faq = () => {
  const [t ] = useTranslation("global");

  return (
    <div className="faq-container">
      <h1>{t("faq.title")}</h1>

      <section className="faq-section">
        <details>
          <summary>{t("faq.q1")}</summary>
          <p>{t("faq.a1")}</p>
        </details>

        <details>
          <summary>{t("faq.q2")}</summary>
          <p>{t("faq.a2")}</p>
        </details>

        <details>
          <summary>{t("faq.q3")}</summary>
          <p>{t("faq.a3")}</p>
        </details>

        <details>
          <summary>{t("faq.q4")}</summary>
          <p>{t("faq.a4")}</p>
        </details>

        <details>
          <summary>{t("faq.q5")}</summary>
          <p>{t("faq.a5")}</p>
        </details>
      </section>
    </div>
  );
};

export default Faq;
