import React, { useEffect, useState } from 'react';
import './Adopt.css';

export default function AdoptionList() {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({ animal: '', gender: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/adoptions.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((data) => {
        setPets(data);
        setLoading(false);
      })
      .catch((err) => {
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

      {/* Pet Cards */}
      <div className="row">
        {filtered.length ? (
          filtered.map((pet) => (
            <div key={pet.id} className="col-sm-6 col-md-4 mb-4">
              <div className="adopt-card card h-100">
                <img
                  src={pet.image}
                  className="card-img-top"
                  alt={pet.animal + ' avatar'}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{pet.animal}</h5>
                  <p className="card-text mb-1"><strong>Age:</strong> {pet.age}</p>
                  <p className="card-text mb-1"><strong>Gender:</strong> {pet.gender}</p>
                  <button className="btn btn-outline-primary mt-auto">
                    Interested
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No animals match your filters.</p>
        )}
      </div>
    </div>
  );
}