import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SEO from './components/SEO';
import NotFound from './pages/NotFound';
import { locales } from './data/locales';
import Information from './pages/Information';
const LocalizedMicPage = lazy(() => import('./pages/LocalizedMicPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const SpeakerTest = lazy(() => import('./pages/SpeakerTest.jsx'));
const WebcamTest = lazy(() => import('./pages/WebcamTest.jsx'));
const FeaturesPage = lazy(() => import('./pages/Features.jsx'));
const FAQPage = lazy(() => import('./pages/faqs.jsx'));
const BlogPage = lazy(() => import('./pages/blogs.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.tsx'));

// Naye blog aur admin components jo aapne pages folder mein rakhe hain
const AdminBlogEditor = lazy(() => import('./pages/AdminBlogEditor.jsx'));


export function AppRoutes() {
  return (
    <><SEO /><Suspense fallback={<p className="content-page" role="status">Loading page…</p>}>
      <Routes>
        {/* Main Layout ke andar ke standard pages */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="speaker-test" element={<SpeakerTest />} />
          <Route path="webcam-test" element={<WebcamTest />} />
          {locales.map(locale => <Route key={locale.code} path={locale.path.slice(1)} element={<LocalizedMicPage />} />)}
          <Route path="features" element={<FeaturesPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/sample-post" element={<Navigate to="/blog/how-to-test-your-microphone" replace />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="blogs-list" element={<Navigate to="/blog" replace />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<AuthPage initialMode="login" />} />
          <Route path="signup" element={<AuthPage initialMode="register" />} />
          <Route path="test" element={<Navigate to="/" replace />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Information />} />
          <Route path="security" element={<Information />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Standalone Admin Blog Editor Route */}
        <Route path="/admin/editor" element={<AdminBlogEditor />} />
      </Routes>
    </Suspense></>
  );
}

export default function AppRouter() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
