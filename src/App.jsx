import { Suspense, lazy } from 'react';
import Navbar from './Components/Navbar';
import AIAssistant from './Components/AIAssistant';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';

const AdoptionList = lazy(() => import('./Pages/Adopt'));
const Home = lazy(() => import('./Pages/Home'));
const Sightings = lazy(() => import('./Pages/Sightings'));
const Resources = lazy(() => import('./Pages/Resources'));
const Login = lazy(() => import('./Components/Login'));
const Register = lazy(() => import('./Components/Register'));
const ProfileSetup = lazy(() => import('./Components/ProfileSetup'));
const UserDashboard = lazy(() => import('./Components/UserDashboard'));
const AdoptionForm = lazy(() => import('./Components/AdoptionForm'));
const FavoritePets = lazy(() => import('./Components/FavoritePets'));
const Notifications = lazy(() => import('./Components/Notifications'));

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  return currentUser ? (
    children
  ) : (
    <Navigate replace to="/login" state={{ from: location }} />
  );
}

function App() {
  return (
    <AuthProvider>
      <>
        <Navbar />
        <Suspense fallback={<main className="container py-5"><p>Loading...</p></main>}>
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
        </Suspense>
        <AIAssistant />
      </>
    </AuthProvider>
  );
}

export default App;
