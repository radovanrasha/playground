import weather from "../assets/weatherapp.png";
import notes from "../assets/notesapp.png";
import portfolio from "../assets/portfolio.png";

const Projects = () => {
  return (
    <div className="container">
      <p className="header-div"> &lt;Projects/&gt;</p>
      <div class="container">
        <div class="profile-wrapper">
          <div class="profile">
            <div class="profile-image">
              <img src={portfolio} alt="Profile" />
            </div>
            <ul class="social-icons">
              <li>
                <a
                  href="https://portfolio.radovanrasha.com"
                  title="Portfolio Website"
                >
                  <svg
                    style={{ color: "black" }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7,6 L3,12 L7,18"></path>
                    <path d="M10,18 L14,6"></path>
                    <path d="M17,6 L21,12 L17,18"></path>
                  </svg>
                </a>
              </li>
            </ul>
            <div class="profile-name">
              <h2>Portfolio website</h2>
              <div class="profile-bio">
                This is my personal portfolio website. On this site i presented
                myself and all of my skills.
              </div>
            </div>
          </div>
        </div>

        <div class="profile-wrapper">
          <div class="profile">
            <div class="profile-image">
              <img src={weather} alt="Profile" />
            </div>
            <ul class="social-icons">
              <li>
                <a href="https://weather.radovanrasha.com" title="WeatherApp">
                  <svg
                    style={{ color: "black" }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="12" y1="2" x2="12" y2="5"></line>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                    <line x1="2" y1="12" x2="5" y2="12"></line>
                    <line x1="19" y1="12" x2="22" y2="12"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  </svg>
                </a>
              </li>
            </ul>
            <div class="profile-name">
              <h2>Weather website</h2>
              <div class="profile-bio">
                This is website that I made using React and two free APIs.
              </div>
            </div>
          </div>
        </div>

        <div class="profile-wrapper">
          <div class="profile">
            <div class="profile-image">
              <img src={notes} alt="Profile" />
            </div>
            <ul class="social-icons">
              <li>
                <a href="https://notes.radovanrasha.com" title="NotesAPP">
                  <svg
                    style={{ color: "black" }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2 19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V5C22 3.34315 20.6569 2 19 2H5C3.34315 2 2 3.34315 2 5V19ZM20 19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5C4 4.44772 4.44772 4 5 4H10V12.0111L12.395 12.0112L14.0001 9.86419L15.6051 12.0112H18.0001L18 4H19C19.5523 4 20 4.44772 20 5V19ZM16 4H12V9.33585L14.0001 6.66046L16 9.33571V4Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
            </ul>
            <div class="profile-name">
              <h2>Notes website</h2>
              <div class="profile-bio">
                This is fullstack project that I made using Node.js, Express.js,
                MongoDB, React and ANT Design.
              </div>
            </div>
          </div>
        </div>

        {/* <div class="profile-wrapper">
          <div class="profile">
            <div class="profile-image">
              <img src={inprogress} alt="Profile" />
            </div>
            <ul class="social-icons">
              <li>
                <a
                  href="https://plate-palette-radovanrasha.onrender.com"
                  title="RecipesWebsite"
                >
                  <svg
                    style={{ color: "black" }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 3C2 1.89543 2.89543 1 4 1H20C21.1046 1 22 1.89543 22 3V21C22 22.1046 21.1046 23 20 23H4C2.89543 23 2 22.1046 2 21V3ZM4 3V21H20V3H4Z"
                      fill="currentColor"
                    />

                    <path
                      d="M9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V16C7 17.6569 8.34315 19 10 19V5H9Z"
                      fill="currentColor"
                    />

                    <path
                      d="M16 4V15C16 16.6569 14.6569 18 13 18C13 18 13 4 13 4H15ZM14 6H12V8H14V6ZM14 10H12V12H14V10Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
            </ul>
            <div class="profile-name">
              <h2>Recipes website - in progress</h2>
              <div class="profile-bio">
                This is fullstack project that I am making using Node.js,
                Express.js, MongoDB, React, Typescript and MUI.
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Projects;
