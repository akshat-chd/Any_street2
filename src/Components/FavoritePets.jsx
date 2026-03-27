import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import {
  listUserFavorites,
  removeFavorite,
} from '../services/firestoreData';
import './FavoritePets.css';

export default function FavoritePets() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFavorites() {
      if (!currentUser) {
        return;
      }

      try {
        const favoriteData = await listUserFavorites(currentUser);

        if (!isMounted) {
          return;
        }

        setFavorites(favoriteData);
      } catch {
        if (!isMounted) {
          return;
        }

        setFavorites([]);
      }
      setLoading(false);
    }

    hydrateFavorites();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleRemoveFavorite = async (petKey) => {
    const nextFavorites = favorites.filter((pet) => pet.petKey !== petKey);
    setFavorites(nextFavorites);

    try {
      await removeFavorite(currentUser, petKey);
    } catch {
      setFavorites(favorites);
    }
  };

  if (loading) {
    return (
      <main className="favorites-page">
        <div className="favorites-container">
          <p className="favorites-empty">Loading favorites...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="favorites-page">
      <div className="favorites-container">
        <section className="favorites-header">
          <div>
            <p className="favorites-eyebrow">Saved pets</p>
            <h1>Your favorites</h1>
            <p>
              Keep a short list of pets you want to compare before starting an
              application.
            </p>
          </div>
          <div className="favorites-summary">
            <strong>{favorites.length}</strong>
            <span>Saved right now</span>
          </div>
        </section>

        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <h2>No favorites yet</h2>
            <p>
              Save pets from the adoption board to keep them easy to compare and
              revisit.
            </p>
            <Link to="/adopt" className="favorites-action favorites-action--primary">
              Explore adoptable pets
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((pet) => (
              <article key={pet.petKey} className="favorite-card">
                <div className="favorite-card__image-wrap">
                  {pet.image ? (
                    <img src={pet.image} alt={pet.name} className="favorite-card__image" />
                  ) : (
                    <div className="favorite-card__placeholder">{pet.animal}</div>
                  )}
                </div>

                <div className="favorite-card__content">
                  <h2>{pet.name}</h2>
                  <p className="favorite-card__meta">
                    {pet.animal} · {pet.gender} · {pet.age}
                  </p>
                  <p className="favorite-card__location">{pet.location}</p>
                  <p className="favorite-card__details">{pet.details}</p>

                  <div className="favorite-card__actions">
                    <button
                      type="button"
                      className="favorites-action favorites-action--ghost"
                      onClick={() => handleRemoveFavorite(pet.petKey)}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      className="favorites-action favorites-action--primary"
                      onClick={() => navigate(`/adopt/apply/${pet.petKey}`)}
                    >
                      Apply to adopt
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
