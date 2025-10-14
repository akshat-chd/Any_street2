import { Link } from "react-router-dom";
import './Home.css';

function Home() {
  return (
    <main className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to <span className="brand">Anystreet</span></h1>
          <p className="hero-subtitle">
            Connecting loving homes with animals in need.<br />
            Protecting our furry friends, together.
          </p>
          <Link to="/adopt" className="hero-cta">Find a Friend</Link>
        </div>
      </section>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          At <span className="brand">Anystreet</span>, we believe every animal deserves a safe, caring home.<br />
          Whether you’re looking to adopt, report a stray, or learn how to help—
          you’ve come to the right place.
        </p>
      </section>

      <section className="get-involved-section">
        <h2>Get Involved</h2>
        <div className="involved-cards">
          <div className="involved-card">
            <div className="icon-circle">🐾</div>
            <h3>Adopt a Friend</h3>
            <p>Browse animals ready for forever homes. Filter by species, age, and more.</p>
            <Link to="/adopt" className="card-link">View Adoptions</Link>
          </div>
          <div className="involved-card">
            <div className="icon-circle">👀</div>
            <h3>Report Sightings</h3>
            <p>Spotted a lost or stray animal? Let us know so we can help or reunite them with their family.</p>
            <Link to="/sightings" className="card-link">Report Now</Link>
          </div>
          <div className="involved-card">
            <div className="icon-circle">📚</div>
            <h3>Explore Resources</h3>
            <p>Learn about pet care, local shelters, volunteering, and emergency contacts.</p>
            <Link to="/resources" className="card-link">Learn More</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;