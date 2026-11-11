import { Link, useMatch, useResolvedPath } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  AimOutlined,
  FontColorsOutlined,
  UserOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { ThemeContext } from "../ThemeContext";
import sun from "../assets/sun.png";
import moon from "../assets/moon.png";

export default function () {
  const [menuActive, setMenuActive] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // close the mobile menu with Escape
  useEffect(() => {
    if (!menuActive) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuActive(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuActive]);

  return (
    <div className="top-header">
      <nav className={`nav ${menuActive ? "menu-open" : ""}`}>
        <button
          type="button"
          className="hamburger"
          aria-label={menuActive ? "Close menu" : "Open menu"}
          aria-expanded={menuActive}
          aria-controls="main-menu"
          onClick={() => setMenuActive(!menuActive)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        {/* on mobile this list is a drawer; the head and foot only show there */}
        <ul id="main-menu" className={menuActive ? "active" : ""}>
          <li className="menu-head" aria-hidden="true">
            <span className="menu-title">Playground</span>
            <span className="menu-sub">Pick a game</span>
          </li>
          <CustomLink
            setMenuActive={setMenuActive}
            to="/"
            icon={<HomeOutlined />}
          >
            Home
          </CustomLink>
          <CustomLink
            setMenuActive={setMenuActive}
            to="/memory"
            icon={<AppstoreOutlined />}
          >
            Memory Game
          </CustomLink>
          <CustomLink
            setMenuActive={setMenuActive}
            to="/battleship"
            icon={<AimOutlined />}
          >
            Battleship Game
          </CustomLink>
          <CustomLink
            setMenuActive={setMenuActive}
            to="/hangman"
            icon={<FontColorsOutlined />}
          >
            Hangman Game
          </CustomLink>
          <CustomLink
            setMenuActive={setMenuActive}
            to="/about"
            icon={<UserOutlined />}
          >
            About
          </CustomLink>
          <li className="menu-foot" aria-hidden="true">
            since 2023
          </li>
        </ul>
      </nav>
      {menuActive && (
        <div className="menu-backdrop" onClick={() => setMenuActive(false)} />
      )}
      <button className="toggleThemeButton" onClick={toggleTheme}>
        {theme === "light" ? (
          <img className="toggleThemeIcon" src={moon} alt="Profile" />
        ) : (
          <img className="toggleThemeIcon" src={sun} alt="Profile" />
        )}
      </button>
    </div>
  );
}

function CustomLink({ to, children, setMenuActive, icon }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({
    path: resolvedPath.pathname,
    end: true,
  });

  return (
    <li className={isActive ? "active" : ""}>
      <Link
        onClick={() => {
          setMenuActive(false);
        }}
        to={to}
      >
        {icon && <span className="nav-icon">{icon}</span>}
        <span className="nav-label">{children}</span>
        <RightOutlined className="nav-arrow" />
      </Link>
    </li>
  );
}
