import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CompareBar from './components/CompareBar';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ComparePage from './pages/ComparePage';
import WishlistPage from './pages/WishlistPage';
import RecommendationsPage from './pages/RecommendationsPage';
import GuidesPage from './pages/GuidesPage';
import GuideDetailPage from './pages/GuideDetailPage';
import ProfilePage from './pages/ProfilePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminGuidesPage from './pages/admin/AdminGuidesPage';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:id" element={<GuideDetailPage />} />
          
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><AdminReviewsPage /></AdminRoute>} />
          <Route path="/admin/guides" element={<AdminRoute><AdminGuidesPage /></AdminRoute>} />
        </Routes>
      </main>
      <CompareBar />
      <Footer />
    </div>
  );
}

export default App;
