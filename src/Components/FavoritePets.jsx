import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './FavoritePets.css';

export default function FavoritePets() {
    const { currentUser } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                // This would normally fetch from your backend
                // Simulated API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setFavorites([
                    {
                        id: 1,
                        name: 'Max',
                        type: 'Dog',
                        breed: 'Golden Retriever',
                        age: '2 years',
                        image: 'path_to_image',
                        status: 'Available'
                    },
                    {
                        id: 2,
                        name: 'Luna',
                        type: 'Cat',
                        breed: 'Siamese',
                        age: '1 year',
                        image: 'path_to_image',
                        status: 'Available'
                    }
                ]);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch favorite pets');
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [currentUser]);

    const removeFavorite = async (petId) => {
        try {
            // This would normally update your backend
            setFavorites(favorites.filter(pet => pet.id !== petId));
        } catch (err) {
            setError('Failed to remove pet from favorites');
        }
    };

    const applyForAdoption = (petId) => {
        // Navigate to adoption form
        window.location.href = `/adopt/apply/${petId}`;
    };

    if (loading) {
        return <div className="favorites-loading">Loading favorite pets...</div>;
    }

    return (
        <div className="favorites-container">
            <h2>Your Favorite Pets</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="favorites-grid">
                {favorites.length === 0 ? (
                    <div className="no-favorites">
                        You haven't added any pets to your favorites yet.
                    </div>
                ) : (
                    favorites.map(pet => (
                        <div key={pet.id} className="pet-card">
                            <div className="pet-image">
                                {/* Replace with actual image */}
                                <div className="placeholder-image">
                                    {pet.type === 'Dog' ? '🐕' : '🐱'}
                                </div>
                            </div>
                            <div className="pet-info">
                                <h3>{pet.name}</h3>
                                <p>{pet.breed}</p>
                                <p>{pet.age}</p>
                                <p className="status">{pet.status}</p>
                            </div>
                            <div className="pet-actions">
                                <button
                                    className="apply-button"
                                    onClick={() => applyForAdoption(pet.id)}
                                >
                                    Apply to Adopt
                                </button>
                                <button
                                    className="remove-button"
                                    onClick={() => removeFavorite(pet.id)}
                                >
                                    Remove from Favorites
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}