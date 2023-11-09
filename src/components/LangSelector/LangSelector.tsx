import { useTranslation } from "next-i18next";
import styles from "./lang-selector.module.scss";

export default function LangSelector() {
  const { i18n } = useTranslation();
  const availableLanguages = Object.keys(i18n.services.resourceStore.data);
  console.log(availableLanguages);

  return (
    <div className={styles["lang-selector"]}>
      <select
        name="lng-select"
        id="lng-select"
        onChange={(event) => i18n.changeLanguage(event.target.value)}
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
