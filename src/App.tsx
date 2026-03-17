import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { BlogPage } from './pages/BlogPage';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/properties/:slug" element={<PropertyDetailPage />} />
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
            <Route path="/admin/blogs/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <BlogForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
