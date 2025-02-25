import React from "react";
import styles from "./Header.module.scss";
import LanguageSelector from "../components/LanguageSelector";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className={styles.Header}>
      <h1>{title}</h1>
      <LanguageSelector />
    </header>
  );
};

export default Header;
