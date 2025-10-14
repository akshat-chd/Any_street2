import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserDashboard.css';

export default function UserDashboard() {
    const { currentUser } = useAuth();
    const [savedPets, setSavedPets] = useState([]);
    const [applications, setApplications] = useState([]);

    // TODO: Fetch saved pets and applications from backend
    useEffect(() => {
        // Simulate fetching data
        setSavedPets([
            { id: 1, name: 'Max', type: 'Dog', status: 'Saved' },
            { id: 2, name: 'Luna', type: 'Cat', status: 'Saved' }
        ]);
        
        setApplications([
            { id: 1, petName: 'Buddy', status: 'Pending', date: '2025-10-10' },
            { id: 2, petName: 'Milo', status: 'Approved', date: '2025-10-08' }
        ]);
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {currentUser?.email}</h1>
            </header>
            
            <div className="dashboard-grid">
                <section className="dashboard-section">
                    <h2>Saved Pets</h2>
                    <div className="pet-list">
                        {savedPets.map(pet => (
                            <div key={pet.id} className="pet-card">
                                <h3>{pet.name}</h3>
                                <p>Type: {pet.type}</p>
                                <button className="view-button">View Details</button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <h2>Your Applications</h2>
                    <div className="applications-list">
                        {applications.map(app => (
                            <div key={app.id} className="application-card">
                                <h3>{app.petName}</h3>
                                <p>Status: <span className={`status-${app.status.toLowerCase()}`}>{app.status}</span></p>
                                <p>Date: {app.date}</p>
                                <button className="view-button">View Application</button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}