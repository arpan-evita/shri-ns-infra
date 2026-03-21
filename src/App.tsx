import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackToTop } from './components/layout/BackToTop';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AuthPage } from './pages/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProperties } from './pages/admin/AdminProperties';
import { PropertyForm } from './pages/admin/PropertyForm';
import { AdminLeads } from './pages/admin/AdminLeads';
import { AdminAgents } from './pages/admin/AdminAgents';
import { AdminFeatures } from './pages/admin/AdminFeatures';
import { AdminBlogs } from './pages/admin/AdminBlogs';
import { BlogForm } from './pages/admin/BlogForm';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { TestimonialForm } from './pages/admin/TestimonialForm';
import { AdminUsers } from './pages/admin/AdminUsers';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPath && <ScrollProgress />}
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
