import './Sightings.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { createSightingReport } from '../services/firestoreData';

function Sightings() {
  const { currentUser } = useAuth();
  const [species, setSpecies] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!photo) {
      setPreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      await createSightingReport({
        species,
        date,
        location,
        details,
        photoFile: photo,
        reporter: currentUser,
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setSpecies('');
      setDate('');
      setLocation('');
      setDetails('');
      setPhoto(null);
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit sighting.');
    }

    setLoading(false);
  };

  return (
    <main className="container py-5">
      <section className="text-center mb-5">
        <h1 className="display-5">Report an Animal Sighting</h1>
        <p className="text-muted">
          Spotted a stray or lost pet? Fill in the details below so we can help.
        </p>
      </section>
      <form onSubmit={handleSubmit} className="sightings-form needs-validation" noValidate>
        {submitted && (
          <div className="alert alert-success text-center">Thank you! Your sighting has been submitted.</div>
        )}
        {error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : null}
        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label">Species <span style={{color:'#e07a5f'}}>*</span></label>
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
            <label className="form-label">Date Spotted <span style={{color:'#e07a5f'}}>*</span></label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Location <span style={{color:'#e07a5f'}}>*</span></label>
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
            {photo && (
              <div className="mt-2 text-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '180px', maxHeight: '180px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary px-5" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Sighting'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default Sightings;
