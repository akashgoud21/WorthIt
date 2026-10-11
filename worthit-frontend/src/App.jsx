import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import ProductsView from './components/ProductsView';
import WarrantiesView from './components/WarrantiesView';
import DocumentsView from './components/DocumentsView';
import RepairsView from './components/RepairsView';
import ExpensesView from './components/ExpensesView';
import SettingsView from './components/SettingsView';
import ProductRegistrationModal from './components/ProductRegistrationModal';
import ProductDetailsModal from './components/ProductDetailsModal';
import BackendRoadmapModal from './components/BackendRoadmapModal';
import AuthModal from './components/AuthModal';
import LoginPage from './components/LoginPage';

import { INITIAL_PRODUCTS, INITIAL_NOTIFICATIONS, DEMO_USER } from './data/mockData';
import {
  checkBackendHealth,
  fetchProducts,
  fetchNotifications,
  deleteProduct,
  markNotificationRead,
  login,
  getToken,
  getStoredUser,
  clearAuth
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddRepairOpen, setIsAddRepairOpen] = useState(false);
  const [preselectedRepairProductId, setPreselectedRepairProductId] = useState(null);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });

  // Backend real health state
  const [backendStatus, setBackendStatus] = useState({
    isOnline: false,
    data: null,
    error: null,
  });

  const fetchHealth = async () => {
    const health = await checkBackendHealth();
    setBackendStatus(health);
  };

  const loadBackendData = async () => {
    try {
      const token = getToken();
      if (!token) {
        // If not authenticated, do not fetch private user data
        return;
      }

      const [prodsData, notifsData] = await Promise.allSettled([
        fetchProducts(),
        fetchNotifications(),
      ]);

      if (prodsData.status === 'fulfilled' && Array.isArray(prodsData.value)) {
        setProducts(prodsData.value);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }

      if (notifsData.status === 'fulfilled' && Array.isArray(notifsData.value)) {
        setNotifications(notifsData.value);
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } catch (err) {
      console.warn('Backend synchronization warning:', err);
    }
  };

  useEffect(() => {
    fetchHealth();
    loadBackendData();
    const interval = setInterval(() => {
      fetchHealth();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    loadBackendData();
  };

  // Handlers
  const handleAddProduct = (newProduct) => {
    // Refresh live products from MySQL
    loadBackendData();
  };

  const handleAddRepair = (productId, newRepair) => {
    // Refresh live repairs & analytics from MySQL
    loadBackendData();
  };

  const handleAddDocument = (productId, newDoc) => {
    // Refresh live documents from MySQL
    loadBackendData();
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await markNotificationRead(id);
    } catch (e) {
      console.warn('Notification mark read API error:', e);
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
    } catch (e) {
      console.warn('Delete product API error:', e);
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setNotifications((prev) => prev.filter((n) => n.productId !== productId));
    setSelectedProductForDetails(null);
  };

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
    setProducts([]);
    setNotifications([]);
  };

  const handleOpenAddRepairWithProduct = (productId) => {
    setPreselectedRepairProductId(productId);
    setIsAddRepairOpen(true);
  };

  // When no user is authenticated, display the full Login & Register Page
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        backendStatus={backendStatus}
      />
    );
  }

  return (
    <div className="app-layout">
      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={notifications.filter((n) => !n.isRead).length}
        backendStatus={backendStatus}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
      />

      {/* Main Content Area */}
      <div className="app-main-content">
        <Navbar
          activeTab={activeTab}
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onOpenAddProduct={() => setIsAddProductOpen(true)}
          currentUser={currentUser}
          onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
          onLogout={handleLogout}
          backendStatus={backendStatus}
        />

        {/* Tab Views Container */}
        <main className="app-page-container">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              notifications={notifications}
              onOpenAddProduct={() => setIsAddProductOpen(true)}
              onOpenAddRepair={() => {
                setPreselectedRepairProductId(null);
                setIsAddRepairOpen(true);
              }}
              setActiveTab={setActiveTab}
              onOpenRoadmap={() => setIsRoadmapOpen(true)}
              backendStatus={backendStatus}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              products={products}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenAddProduct={() => setIsAddProductOpen(true)}
              onOpenAddRepair={handleOpenAddRepairWithProduct}
              onSelectProductDetails={(prod) => setSelectedProductForDetails(prod)}
            />
          )}

          {activeTab === 'warranties' && (
            <WarrantiesView
              products={products}
              notifications={notifications}
              onOpenAddProduct={() => setIsAddProductOpen(true)}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsView
              products={products}
              onAddDocument={handleAddDocument}
            />
          )}

          {activeTab === 'repairs' && (
            <RepairsView
              products={products}
              onAddRepair={handleAddRepair}
              isAddRepairOpen={isAddRepairOpen}
              setIsAddRepairOpen={setIsAddRepairOpen}
              preselectedProductId={preselectedRepairProductId}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView products={products} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              backendStatus={backendStatus}
              onRefreshHealth={fetchHealth}
              onOpenRoadmap={() => setIsRoadmapOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Product Registration Modal */}
      <ProductRegistrationModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProductForDetails}
        onClose={() => setSelectedProductForDetails(null)}
        onOpenAddRepair={handleOpenAddRepairWithProduct}
        onDeleteProduct={handleDeleteProduct}
      />

      {/* Backend API Roadmap Inspection Modal */}
      <BackendRoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
        backendStatus={backendStatus}
        onRefreshHealth={fetchHealth}
      />

      {/* Authentication (Login & Register) Modal for switching accounts */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
