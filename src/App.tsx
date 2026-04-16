import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackToTop } from './components/layout/BackToTop';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// HomePage is eager — renders immediately, no Suspense flash = zero CLS on initial load
import { HomePage } from './pages/HomePage';

// Secondary public pages — lazy loaded (user navigates to these after initial load)
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage').then(m => ({ default: m.PropertiesPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage').then(m => ({ default: m.PropertyDetailPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const SubmitProjectPage = lazy(() => import('./pages/SubmitProjectPage').then(m => ({ default: m.SubmitProjectPage })));

// Admin pages - lazy loaded (heaviest chunk, users avoid loading if not admin)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties').then(m => ({ default: m.AdminProperties })));
const PropertyForm = lazy(() => import('./pages/admin/PropertyForm').then(m => ({ default: m.PropertyForm })));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads').then(m => ({ default: m.AdminLeads })));
const AdminAgents = lazy(() => import('./pages/admin/AdminAgents').then(m => ({ default: m.AdminAgents })));
const AdminFeatures = lazy(() => import('./pages/admin/AdminFeatures').then(m => ({ default: m.AdminFeatures })));
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs').then(m => ({ default: m.AdminBlogs })));
const BlogForm = lazy(() => import('./pages/admin/BlogForm').then(m => ({ default: m.BlogForm })));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials').then(m => ({ default: m.AdminTestimonials })));
const TestimonialForm = lazy(() => import('./pages/admin/TestimonialForm').then(m => ({ default: m.TestimonialForm })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminSubmissions = lazy(() => import('./pages/admin/AdminSubmissions').then(m => ({ default: m.AdminSubmissions })));

// Minimal page loader - no heavy spinner libraries
const PageLoader = () => (
  <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0906' }}>
    <div style={{ width: 40, height: 40, border: '2px solid #c4a661', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/auth' || location.pathname === '/submit-project';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPath && <ScrollProgress />}
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/submit-project" element={<SubmitProjectPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/properties/:slug" element={<PropertyDetailPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/properties" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProperties />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/properties/new" element={
              <ProtectedRoute>
                <AdminLayout>
                  <PropertyForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/properties/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <PropertyForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/agents" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminAgents />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/leads" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminLeads />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/features" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminFeatures />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/submissions" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSubmissions />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blogs" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminBlogs />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blogs/new" element={
              <ProtectedRoute>
                <AdminLayout>
                  <BlogForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/testimonials" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminTestimonials />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/testimonials/new" element={
              <ProtectedRoute>
                <AdminLayout>
                  <TestimonialForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/testimonials/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <TestimonialForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </main>
      {!isAdminPath && <BackToTop />}
      {!isAdminPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
