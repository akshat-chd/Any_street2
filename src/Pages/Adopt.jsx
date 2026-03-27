import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import {
  listUserApplications,
  listUserFavorites,
  removeFavorite,
  saveFavorite,
} from '../services/firestoreData';
import { loadPetCatalog } from '../utils/pets';
import { formatDisplayDate } from '../utils/storage';
import './Adopt.css';

export default function AdoptionList() {
  const { currentUser } = useAuth();
  const [pets, setPets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    animal: '',
    gender: '',
    source: 'all',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function hydrateAdoptionPage() {
      try {
        const catalog = await loadPetCatalog();

        if (!isMounted) {
          return;
        }

        setPets(catalog);
        setLoading(false);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError.message || 'Failed to load pets');
        setLoading(false);
      }
    }

    hydrateAdoptionPage();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function hydrateUserState() {
      if (!currentUser) {
        return;
      }

      const [favoriteData, applicationData] = await Promise.all([
        listUserFavorites(currentUser),
        listUserApplications(currentUser),
      ]);

      if (!isMounted) {
        return;
      }

      setFavorites(favoriteData);
      setApplications(applicationData);
    }

    hydrateUserState();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const favoriteKeys = new Set(favorites.map((pet) => pet.petKey));
  const appliedPetKeys = new Set(applications.map((application) => application.petKey));

  const filteredPets = pets.filter((pet) => {
    const matchesAnimal = !filters.animal || pet.animal === filters.animal;
    const matchesGender = !filters.gender || pet.gender === filters.gender;
    const matchesSource =
      filters.source === 'all' || pet.source === filters.source;

    const normalizedSearch = filters.search.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      [pet.name, pet.animal, pet.location, pet.details, pet.breed, pet.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesAnimal && matchesGender && matchesSource && matchesSearch;
  });

  const toggleFavorite = async (pet) => {
    const isFavorite = favoriteKeys.has(pet.petKey);
    const nextFavorites = isFavorite
      ? favorites.filter((favoritePet) => favoritePet.petKey !== pet.petKey)
      : [pet, ...favorites];

    setFavorites(nextFavorites);

    if (isFavorite) {
      await removeFavorite(currentUser, pet.petKey);
      return;
    }

    await saveFavorite(currentUser, pet);
  };

  if (loading) {
    return <p className="adopt-state">Loading pets...</p>;
  }

  if (error) {
    return <p className="adopt-state adopt-state--error">Error: {error}</p>;
  }

  const adoptableCount = pets.filter((pet) => !pet.isSighting).length;
  const sightingsCount = pets.filter((pet) => pet.isSighting).length;

  return (
    <main className="adopt-page">
      <div className="adopt-container">
        <section className="adopt-hero">
          <div>
            <p className="adopt-eyebrow">Adoption board</p>
            <h1 className="adopt-header">Adoptable pets and community reports</h1>
            <p className="adopt-hero__copy">
              Browse available pets, save the ones you care about, and keep
              sighting reports visible without mixing them up with formal
              adoption applications.
            </p>
          </div>
          <div className="adopt-hero__stats">
            <article>
              <strong>{adoptableCount}</strong>
              <span>Adoptable pets</span>
            </article>
            <article>
              <strong>{sightingsCount}</strong>
              <span>Community reports</span>
            </article>
            <article>
              <strong>{favorites.length}</strong>
              <span>Saved by you</span>
            </article>
          </div>
        </section>

        <section className="adopt-toolbar">
          <label className="adopt-search">
            <span>Search</span>
            <input
              type="search"
              placeholder="Name, breed, location, or detail"
              value={filters.search}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  search: event.target.value,
                }))
              }
            />
          </label>

          <label className="adopt-select">
            <span>Animal</span>
            <select
              value={filters.animal}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  animal: event.target.value,
                }))
              }
            >
              <option value="">All animals</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Bird">Bird</option>
            </select>
          </label>

          <label className="adopt-select">
            <span>Gender</span>
            <select
              value={filters.gender}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  gender: event.target.value,
                }))
              }
            >
              <option value="">Any gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <label className="adopt-select">
            <span>Source</span>
            <select
              value={filters.source}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  source: event.target.value,
                }))
              }
            >
              <option value="all">All sources</option>
              <option value="adoption">Adoption board</option>
              <option value="sighting">Community sightings</option>
            </select>
          </label>
        </section>

        <p className="adopt-results">
          Showing {filteredPets.length} of {pets.length} listings.
        </p>

        <section className="adopt-catalog">
          {filteredPets.length === 0 ? (
            <div className="adopt-empty">
              <h2>No matches found</h2>
              <p>
                Try broadening the filters or report a new sighting if the
                animal is not listed yet.
              </p>
              <Link to="/sightings" className="adopt-button adopt-button--primary">
                Report a sighting
              </Link>
            </div>
          ) : (
            filteredPets.map((pet) => {
              const isFavorite = favoriteKeys.has(pet.petKey);
              const hasApplied = appliedPetKeys.has(pet.petKey);

              return (
                <article key={pet.petKey} className="adopt-card">
                  <div className="adopt-card__image-wrap">
                    {pet.image ? (
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="adopt-card__image"
                      />
                    ) : (
                      <div className="adopt-card__placeholder">{pet.animal}</div>
                    )}
                  </div>

                  <div className="adopt-card__content">
                    <div className="adopt-card__badges">
                      <span className="adopt-badge">{pet.isSighting ? 'Sighting' : 'Adoption'}</span>
                      <span className="adopt-badge adopt-badge--muted">{pet.status}</span>
                    </div>

                    <h2>{pet.name}</h2>
                    <p className="adopt-card__meta">
                      {pet.animal} · {pet.gender} · {pet.age}
                    </p>
                    <p className="adopt-card__location">{pet.location}</p>
                    <p className="adopt-card__description">{pet.details}</p>
                    {pet.breed ? (
                      <p className="adopt-card__supporting">Breed: {pet.breed}</p>
                    ) : null}
                    {pet.date ? (
                      <p className="adopt-card__supporting">
                        Reported on {formatDisplayDate(pet.date)}
                      </p>
                    ) : null}

                    <div className="adopt-card__actions">
                      {pet.isSighting ? (
                        <Link
                          to="/sightings"
                          className="adopt-button adopt-button--secondary"
                        >
                          Add another report
                        </Link>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={`adopt-button ${isFavorite ? 'adopt-button--ghost is-saved' : 'adopt-button--ghost'}`}
                            onClick={() => toggleFavorite(pet)}
                          >
                            {isFavorite ? 'Saved to favorites' : 'Save to favorites'}
                          </button>

                          {hasApplied ? (
                            <Link
                              to="/dashboard"
                              className="adopt-button adopt-button--secondary"
                            >
                              View application
                            </Link>
                          ) : (
                            <Link
                              to={`/adopt/apply/${pet.petKey}`}
                              className="adopt-button adopt-button--primary"
                            >
                              Apply to adopt
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
