import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, saveUserProfile } from '../services/firestoreData';
import './ProfileSetup.css';

export default function ProfileSetup() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
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

    useEffect(() => {
        let isMounted = true;

        async function hydrateProfile() {
            if (!currentUser) {
                return;
            }

            try {
                const savedProfile = await getUserProfile(currentUser);

                if (!isMounted) {
                    return;
                }

                setFormData((previous) => ({
                    ...previous,
                    ...savedProfile,
                    fullName:
                        savedProfile.fullName || currentUser.displayName || previous.fullName,
                    email: savedProfile.email || currentUser.email || previous.email,
                }));
            } catch {
                if (!isMounted) {
                    return;
                }

                setFormData((previous) => ({
                    ...previous,
                    fullName: currentUser.displayName || previous.fullName,
                    email: currentUser.email || previous.email,
                }));
            }
        }

        hydrateProfile();

        return () => {
            isMounted = false;
        };
    }, [currentUser]);

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
            await new Promise(resolve => setTimeout(resolve, 500));
            await saveUserProfile(currentUser, {
                ...formData,
                email: currentUser?.email || formData.email,
            });
            navigate('/dashboard', {
                state: { message: 'Profile updated successfully.' }
            });
        } catch {
            setError('Failed to save profile information');
        }
        setLoading(false);
    };

    return (
        <div className="profile-setup-container">
            <div className="profile-setup-card">
                <h2>Complete Your Profile</h2>
                <p className="profile-setup-subtitle">
                    Add the details shelters usually need before they review an application.
                </p>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="profile-form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="profile-form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                        />
                    </div>

                    <div className="profile-form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="profile-form-group">
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
                        <div className="profile-form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="profile-form-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="profile-form-group">
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

                    <div className="profile-form-group">
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

                    <div className="profile-form-group checkbox-group">
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

                    <div className="profile-form-group">
                        <label>Do you have any existing pets?</label>
                        <textarea
                            name="existingPets"
                            value={formData.existingPets}
                            onChange={handleChange}
                            placeholder="Please describe any pets you currently have..."
                        />
                    </div>

                    <div className="profile-form-group">
                        <label>Pet Care Experience</label>
                        <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Tell us about your experience with pets..."
                        />
                    </div>

                    <div className="profile-form-group">
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

                    <button disabled={loading} type="submit" className="profile-submit-button">
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
