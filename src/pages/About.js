// import "../styles/About.css";
import about3 from "../assets/about3.jpg";

const PORTFOLIO_URL = "https://portfolio.radovanrasha.com";

const About = () => {
  return (
    <div className="about-container">
      <p className="header-div"> &lt;About/&gt;</p>
      <div className="about-row">
        <img
          className="leftslide"
          style={{ animationDelay: "0.3s" }}
          src={about3}
          alt="Radovan Rasha"
        />
        <div className="text-content">
          <p className="rightslide" style={{ animationDelay: "0.3s" }}>
            Hi, I'm Radovan, a full-stack JavaScript developer from Serbia. I
            mostly work on the backend with Node.js, Express and MongoDB, and
            build frontends with React and Ant Design.
          </p>
          <p className="rightslide" style={{ animationDelay: "0.6s" }}>
            Playground is one of my personal projects: a set of browser games
            with real-time multiplayer built on Socket.IO. I keep learning
            through courses, coding competitions and side projects like this
            one.
          </p>
          <p className="rightslide" style={{ animationDelay: "0.9s" }}>
            I started this project in 2023 and have kept adding new games to it
            over time. Recently I gave the design and the overall look of the
            app a big upgrade.
          </p>
          <a
            className="about-portfolio-link rightslide"
            style={{ animationDelay: "1.2s" }}
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View my portfolio
            <span className="about-link-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
