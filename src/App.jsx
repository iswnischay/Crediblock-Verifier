import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Verifier from "./Verifier";
import Home from "./Home";
import "./App.css";

const App = () => {
  const [theme, setTheme] = useState("light");

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const htmlElement = document.getElementById("root-html");
    htmlElement.setAttribute("data-bs-theme", newTheme);
  };

  // Effect to load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      // Immediately apply the theme to the html element
      document.getElementById("root-html").setAttribute("data-bs-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.getElementById("root-html").setAttribute("data-bs-theme", initialTheme);
    }
  }, []);

  // Apply the theme class to the body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <Router>
      <div className="container">
        <nav className="fixed-top">
          <Link className="ref" to="/">Home</Link>
          <Link className="ref" to="/verifier">Verifier</Link>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "light" ? (
              <i className="bi bi-moon-fill"></i>
            ) : (
              <i className="bi bi-sun-fill"></i>
            )}
          </button>
        </nav>

        <Routes>
          <Route path="/verifier" element={<Verifier />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;