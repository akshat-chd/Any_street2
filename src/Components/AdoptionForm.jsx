import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import {
  createApplication,
  createUserNotification,
  listUserApplications,
} from '../services/firestoreData';
import { findPetByKey } from '../utils/pets';
import {
  createNotification,
  formatDisplayDate,
} from '../utils/storage';
import './AdoptionForm.css';

export default function AdoptionForm() {
  const { currentUser } = useAuth();
  const { petId } = useParams();
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState(null);
  const [loadingPet, setLoadingPet] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    livingArrangement: '',
    landlordApproval: 'no',
    hoursAlone: '',
    exercise: '',
    otherPets: '',
    previousPets: '',
    veterinarian: '',
    emergencyPlan: '',
    income: '',
    familyAgreement: false,
    homeVisit: false,
    references: ['', '', ''],
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSelectedPet() {
      try {
        const pet = await findPetByKey(petId);

        if (!isMounted) {
          return;
        }

        if (!pet || pet.isSighting) {
          setError('This listing is not available for adoption applications.');
          setSelectedPet(null);
        } else {
          setSelectedPet(pet);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load pet details.');
        }
      } finally {
        if (isMounted) {
          setLoadingPet(false);
        }
      }
    }

    loadSelectedPet();

    return () => {
      isMounted = false;
    };
  }, [petId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleReferenceChange = (index, value) => {
    const nextReferences = [...formData.references];
    nextReferences[index] = value;

    setFormData((previous) => ({
      ...previous,
      references: nextReferences,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedPet) {
      setError('A valid pet is required before submitting this application.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const existingApplications = await listUserApplications(currentUser);

      if (existingApplications.some((application) => application.petKey === selectedPet.petKey)) {
        setError('You already submitted an application for this pet.');
        setLoading(false);
        return;
      }

      const applicationRecord = {
        id: `application-${Date.now()}`,
        petKey: selectedPet.petKey,
        petName: selectedPet.name,
        animal: selectedPet.animal,
        image: selectedPet.image,
        location: selectedPet.location,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        applicantEmail: currentUser?.email || '',
        ...formData,
      };

      await createApplication(currentUser, applicationRecord);
      await createUserNotification(
        currentUser,
        createNotification({
          type: 'application',
          message: `Application submitted for ${selectedPet.name}.`,
          link: '/dashboard',
        })
      );

      navigate('/dashboard', {
        state: { message: `Application submitted for ${selectedPet.name}.` },
      });
    } catch {
      setError('Failed to submit application. Please try again.');
    }

    setLoading(false);
  };

  if (loadingPet) {
    return <div className="adoption-form-state">Loading application form...</div>;
  }

  if (!selectedPet) {
    return (
      <div className="adoption-form-state adoption-form-state--error">
        <h2>Application unavailable</h2>
        <p>{error || 'The pet you selected could not be loaded.'}</p>
        <Link to="/adopt" className="adoption-form-link">
          Back to adoption board
        </Link>
      </div>
    );
  }

  return (
    <main className="adoption-form-page">
      <div className="adoption-form-container">
        <section className="adoption-form-hero">
          <div className="adoption-form-hero__image-wrap">
            {selectedPet.image ? (
              <img
                src={selectedPet.image}
                alt={selectedPet.name}
                className="adoption-form-hero__image"
              />
            ) : null}
          </div>

          <div className="adoption-form-hero__content">
            <p className="adoption-form-eyebrow">Adoption application</p>
            <h1>Apply for {selectedPet.name}</h1>
            <p className="adoption-form-hero__meta">
              {selectedPet.animal} · {selectedPet.gender} · {selectedPet.age}
            </p>
            <p className="adoption-form-hero__location">{selectedPet.location}</p>
            <p className="adoption-form-hero__details">{selectedPet.details}</p>
            <p className="adoption-form-hero__supporting">
              Start date: {formatDisplayDate(new Date().toISOString())}
            </p>
          </div>
        </section>

        <section className="adoption-form-card">
          <h2>Tell us about your setup</h2>
          <p className="adoption-form-subtitle">
            This helps match the pet with a home that fits their needs.
          </p>
          {error ? <div className="alert alert-danger">{error}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="adoption-form-group">
              <label>Current Living Arrangement</label>
              <select
                name="livingArrangement"
                value={formData.livingArrangement}
                onChange={handleChange}
                required
              >
                <option value="">Select...</option>
                <option value="house">Own House</option>
                <option value="apartment">Rent Apartment</option>
                <option value="condo">Rent Condo</option>
                <option value="other">Other</option>
              </select>
            </div>

            {(formData.livingArrangement === 'apartment' ||
              formData.livingArrangement === 'condo') && (
              <div className="adoption-form-group">
                <label>Do you have landlord approval?</label>
                <select
                  name="landlordApproval"
                  value={formData.landlordApproval}
                  onChange={handleChange}
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            )}

            <div className="adoption-form-grid">
              <div className="adoption-form-group">
                <label>How many hours will the pet be alone each day?</label>
                <input
                  type="number"
                  name="hoursAlone"
                  value={formData.hoursAlone}
                  onChange={handleChange}
                  required
                  min="0"
                  max="24"
                />
              </div>

              <div className="adoption-form-group">
                <label>Monthly Income Range</label>
                <select
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select...</option>
                  <option value="0-2000">$0 - $2,000</option>
                  <option value="2001-4000">$2,001 - $4,000</option>
                  <option value="4001-6000">$4,001 - $6,000</option>
                  <option value="6001+">$6,001+</option>
                </select>
              </div>
            </div>

            <div className="adoption-form-group">
              <label>How will you exercise or entertain the pet?</label>
              <textarea
                name="exercise"
                value={formData.exercise}
                onChange={handleChange}
                required
              />
            </div>

            <div className="adoption-form-group">
              <label>Do you have other pets? If yes, please describe</label>
              <textarea
                name="otherPets"
                value={formData.otherPets}
                onChange={handleChange}
                required
              />
            </div>

            <div className="adoption-form-group">
              <label>Previous pet experience</label>
              <textarea
                name="previousPets"
                value={formData.previousPets}
                onChange={handleChange}
                required
              />
            </div>

            <div className="adoption-form-group">
              <label>Current or previous veterinarian contact</label>
              <input
                type="text"
                name="veterinarian"
                value={formData.veterinarian}
                onChange={handleChange}
              />
            </div>

            <div className="adoption-form-group">
              <label>Emergency care plan</label>
              <textarea
                name="emergencyPlan"
                value={formData.emergencyPlan}
                onChange={handleChange}
                required
                placeholder="What is your plan for pet care in case of emergency?"
              />
            </div>

            <div className="adoption-form-references">
              <h3>References</h3>
              {formData.references.map((reference, index) => (
                <div key={index} className="adoption-form-group">
                  <label>Reference {index + 1} (Name and Contact)</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(event) => handleReferenceChange(index, event.target.value)}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="adoption-form-group adoption-form-group--checkbox">
              <label>
                <input
                  type="checkbox"
                  name="familyAgreement"
                  checked={formData.familyAgreement}
                  onChange={handleChange}
                  required
                />
                All family members agree to this adoption
              </label>
            </div>

            <div className="adoption-form-group adoption-form-group--checkbox">
              <label>
                <input
                  type="checkbox"
                  name="homeVisit"
                  checked={formData.homeVisit}
                  onChange={handleChange}
                  required
                />
                I agree to a home visit if required
              </label>
            </div>

            <button type="submit" className="adoption-submit-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
