import React, { useEffect, useState } from 'react';
import './Adopt.css';

export default function AdoptionList() {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({ animal: '', gender: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/adoptions.json')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch data');
          return res.json();
        })
        .catch(() => []),
      Promise.resolve(JSON.parse(localStorage.getItem('sightings') || '[]'))
    ]).then(([adoptions, sightings]) => {
      // Merge sightings and adoptions
      setPets([...sightings, ...adoptions]);
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  const filtered = pets.filter((pet) =>
    (!filters.animal || pet.animal === filters.animal) &&
    (!filters.gender || pet.gender === filters.gender)
  );

  const handleFilter = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };
  if (loading) return <p>Loading pets…</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="adopt-container">
      <h2 className="adopt-header">Adoptable Animals</h2>

      {/* Filters */}
      <div className="adopt-filters">
        <select
          value={filters.animal}
          onChange={handleFilter('animal')}
        >
          <option value="">All Animals</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Bird">Bird</option>
        </select>
        <select
          value={filters.gender}
          onChange={handleFilter('gender')}
        >
          <option value="">Any Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Pet Catalog Grid */}
      <div className="adopt-catalog">
        {filtered.length === 0 ? (
          <p>No pets found.</p>
        ) : (
          filtered.map((pet) => (
            <div key={pet.id || pet.name} className="adopt-card">
              <div className="adopt-img-wrap">
                {(pet.photo || pet.image) && (
                  <img src={pet.photo || pet.image} alt={pet.animal || pet.name} className="adopt-img" />
                )}
              </div>
              <div className="adopt-info">
                <h3 className="card-title">{pet.name || pet.animal || 'Unknown'}</h3>
                <p><strong>Species:</strong> {pet.animal || 'Unknown'}</p>
                {pet.location && <p><strong>Location:</strong> {pet.location}</p>}
                {pet.details && <p><strong>Details:</strong> {pet.details}</p>}
                {pet.date && <p><strong>Date Spotted:</strong> {pet.date}</p>}
                {pet.gender && <p><strong>Gender:</strong> {pet.gender}</p>}
                {pet.age && <p><strong>Age:</strong> {pet.age}</p>}
                {pet.fromSighting && <span className="badge bg-warning text-dark">Reported Sighting</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}