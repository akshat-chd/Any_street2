import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfileSetup.css';

export default function ProfileSetup() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        housingType: '',
        hasYard: false,
        existingPets: '',
        experience: '',
        preferredPetTypes: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const petTypes = ['Dogs', 'Cats', 'Birds', 'Small Animals'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePetTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            preferredPetTypes: prev.preferredPetTypes.includes(type)
                ? prev.preferredPetTypes.filter(t => t !== type)
                : [...prev.preferredPetTypes, type]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Here you would save the profile data to your database
            // For now, we'll just simulate it
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to save profile information');
        }
        setLoading(false);
    };

    return (
        <div className="profile-setup-container">
            <div className="profile-setup-card">
                <h2>Complete Your Profile</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="address-grid">
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>ZIP Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Housing Type</label>
                        <select
                            name="housingType"
                            value={formData.housingType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select...</option>
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="condo">Condo</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="hasYard"
                                checked={formData.hasYard}
                                onChange={handleChange}
                            />
                            Do you have a yard?
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Do you have any existing pets?</label>
                        <textarea
                            name="existingPets"
                            value={formData.existingPets}
                            onChange={handleChange}
                            placeholder="Please describe any pets you currently have..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Pet Care Experience</label>
                        <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Tell us about your experience with pets..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Interested in adopting (select all that apply):</label>
                        <div className="pet-types-grid">
                            {petTypes.map(type => (
                                <label key={type} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.preferredPetTypes.includes(type)}
                                        onChange={() => handlePetTypeChange(type)}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="submit-button">
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}