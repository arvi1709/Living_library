

import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import ResourcePage from './pages/ResourcePage';
import AIAssistantPage from './pages/AIAssistantPage';
import AboutUsPage from './pages/AboutUsPage';
import AddStoryPage from './pages/AddStoryPage';
import ProfilePage from './pages/ProfilePage';
import EditStoryPage from './pages/EditStoryPage';
import AuthPage from './pages/AuthPage';

const MainContent: React.FC = () => {
  const location = useLocation();
  return (
    <main key={location.pathname} className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/resource/:id" element={<ResourcePage />} />
        <Route path="/assistant" element={<AIAssistantPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/add-story" element={<AddStoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-story/:id" element={<EditStoryPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;