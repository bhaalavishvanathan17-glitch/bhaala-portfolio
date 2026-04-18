import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider }  from './context/AuthContext';
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
            {/* Login has its own layout (no shared Navbar) */}
            <Route path="/login" element={<LoginPage />} />

            {/* All other routes share the Navbar */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/"        element={<Home />}        />
                  <Route path="/about"   element={<AboutPage />}   />
                  <Route path="/school"  element={<SchoolPage />}  />
                  <Route path="/college" element={<CollegePage />} />
                </Routes>
              </>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
