import { useState } from "react";
import './Sightings.css';
 function Sightings() {
  const [species, setSpecies] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you! Your ${species || "animal"} sighting has been submitted.`);
    setSpecies("");
    setDate("");
    setLocation("");
    setDetails("");
    setPhoto(null);
  };

  return (
    <main className="container py-5">
      <section className="text-center mb-5">
        <h1 className="display-5">Report an Animal Sighting</h1>
        <p className="text-muted">
          Spotted a stray or lost pet? Fill in the details below so we can help.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label">Species</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dog, Cat, Bird"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Date Spotted</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Address or landmark"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Additional Details</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Color, behavior, anything else you noticed..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Upload Photo (optional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary px-5">
            Submit Sighting
          </button>
        </div>
      </form>
    </main>
  );
}
export default Sightings;
