import { Link } from "react-router-dom";
import './Home.css';
function Home() {
  return (
    <main className="home-container">
      <section className="home-header">
        <h1>Welcome to Anystreet</h1>
        <p>
          Connecting loving homes with animals in need, and helping you
          protect our furry friends wherever you are.
        </p>
      </section>

      <section className="home-section">
        <h2>Our Mission</h2>
        <p>
          At Anystreet, we believe every animal deserves a safe,
          caring home. Whether you’re looking to adopt a companion,
          report a stray you’ve spotted, or learn how to help—
          you’ve come to the right place.
        </p>
      </section>

      {/* What You Can Do */}
      <section className="home-section">
        <h2 className="text-center">Get Involved</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h3 className="h5">Adopt a Friend</h3>
                <p className="flex-grow-1">
                  Browse profiles of animals ready for forever homes.
                  Filter by species, age, size, and more.
                </p>
                <Link to="/adopt" className="btn btn-primary mt-auto">
                  View Adoptions
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h3 className="h5">Report Sightings</h3>
                <p className="flex-grow-1">
                  Spotted a lost or stray animal? Let us know
                  exactly where—so we can send help or reunite
                  them with their family.
                </p>
                <Link to="/pages/sightings" className="btn btn-primary mt-auto">
                  Report Now
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h3 className="h5">Explore Resources</h3>
                <p className="flex-grow-1">
                  Learn about caring for pets, local shelters,
                  volunteering opportunities, and emergency contacts.
                </p>
                <Link to="/pages/resources" className="btn btn-primary mt-auto">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  

)
}
export default Home;