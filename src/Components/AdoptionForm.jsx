import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdoptionForm.css';

export default function AdoptionForm({ petId, petName }) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
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
        references: ['', '', '']
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleReferenceChange = (index, value) => {
        const newReferences = [...formData.references];
        newReferences[index] = value;
        setFormData(prev => ({
            ...prev,
            references: newReferences
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Here you would submit the application to your backend
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/dashboard', { 
                state: { message: 'Application submitted successfully!' }
            });
        } catch (err) {
            setError('Failed to submit application. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="adoption-form-container">
            <div className="adoption-form-card">
                <h2>Adoption Application for {petName}</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
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
                        <div className="form-group">
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

                    <div className="form-group">
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

                    <div className="form-group">
                        <label>How will you exercise/entertain the pet?</label>
                        <textarea
                            name="exercise"
                            value={formData.exercise}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Do you have other pets? If yes, please describe:</label>
                        <textarea
                            name="otherPets"
                            value={formData.otherPets}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Previous pet experience:</label>
                        <textarea
                            name="previousPets"
                            value={formData.previousPets}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Current/Previous Veterinarian Contact:</label>
                        <input
                            type="text"
                            name="veterinarian"
                            value={formData.veterinarian}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Emergency Care Plan:</label>
                        <textarea
                            name="emergencyPlan"
                            value={formData.emergencyPlan}
                            onChange={handleChange}
                            required
                            placeholder="What is your plan for pet care in case of emergency?"
                        />
                    </div>

                    <div className="form-group">
                        <label>Monthly Income Range:</label>
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

                    <div className="references-section">
                        <h3>References</h3>
                        {formData.references.map((reference, index) => (
                            <div key={index} className="form-group">
                                <label>Reference {index + 1} (Name and Contact):</label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => handleReferenceChange(index, e.target.value)}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div className="form-group checkbox-group">
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

                    <div className="form-group checkbox-group">
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

                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
}