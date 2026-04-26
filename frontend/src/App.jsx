import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider }  from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import AboutPage   from './pages/AboutPage';
import SchoolPage  from './pages/SchoolPage';
import CollegePage from './pages/CollegePage';
import LoginPage   from './pages/LoginPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public — Login page (no Navbar) */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected — all other routes require login */}
            <Route path="/*" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/"        element={<Home />}        />
                    <Route path="/about"   element={<AboutPage />}   />
                    <Route path="/school"  element={<SchoolPage />}  />
                    <Route path="/college" element={<CollegePage />} />
                    {/* Any unknown path → home */}
                    <Route path="*"        element={<Navigate to="/" replace />} />
                  </Routes>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
