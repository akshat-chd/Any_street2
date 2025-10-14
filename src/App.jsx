


import Navbar from './Components/Navbar';
import AdoptionList from './Pages/Adopt';
import Home from './Pages/Home';
import Sightings from './Pages/Sightings';
import Resources from './Pages/Resources';
import Login from './Components/Login';
import Register from './Components/Register';
import ProfileSetup from './Components/ProfileSetup';
import UserDashboard from './Components/UserDashboard';
import AdoptionForm from './Components/AdoptionForm';
import FavoritePets from './Components/FavoritePets';
import Notifications from './Components/Notifications';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/adopt' element={
            <PrivateRoute>
              <AdoptionList />
            </PrivateRoute>
          } />
          <Route path='/sightings' element={<Sightings />} />
          <Route path='/resources' element={<Resources />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile-setup' element={
            <PrivateRoute>
              <ProfileSetup />
            </PrivateRoute>
          } />
          <Route path='/dashboard' element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          } />
          <Route path='/favorites' element={
            <PrivateRoute>
              <FavoritePets />
            </PrivateRoute>
          } />
          <Route path='/notifications' element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          } />
          <Route path='/adopt/apply/:petId' element={
            <PrivateRoute>
              <AdoptionForm />
            </PrivateRoute>
          } />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
