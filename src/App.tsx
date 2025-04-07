import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { getCurrentUser } from './lib/auth'; 
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/Toast';
import Layout from './components/Layout';
import { useNetwork } from './hooks/useNetwork';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ShortcutsHelp } from './components/common/ShortcutsHelp';
import { LoadingOverlay } from './components/common/LoadingOverlay';
import OfflinePage from './pages/OfflinePage';

// Import all page components
import CourseDetails from './pages/CourseDetails';
import CourseManagement from './pages/CourseManagement';
import MenuItems from './pages/MenuItems';
import { CourseDetails as CourseEdit } from './pages/CourseDetails';
import Login from './pages/Login';
import Workspace from './pages/Workspace';
import MyWork from './pages/MyWork';
import Dashboard from './pages/Dashboard';
import Oversight from './pages/Oversight';
import SpecialDiets from './pages/SpecialDiets';
import MenuPlanner from './pages/MenuPlanner';
import Learning from './pages/Learning';
import Products from './pages/Products';
import Distribution from './pages/Distribution';
import OrderDetails from './pages/Distribution/OrderDetails';
import Workflow from './pages/Distribution/Workflow';
import Onboarding from './pages/Onboarding';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import LearningManagement from './pages/LearningManagement';
import Profile from './pages/Profile';
import Preferences from './pages/Preferences';
import Productivity from './pages/Productivity';
import Community from './pages/Community';
import LearningModule from './pages/LearningModule';
import LearningResource from './pages/LearningResource';
import CourseList from './pages/CourseList';
import Financials from './pages/Financials';
import Digitize from './pages/Digitize';
import MenuCycleSchoolAnalysis from './pages/MenuCycleSchoolAnalysis';
import MenuCyclesList from './pages/MenuCyclesList';
import MenuCycles from './pages/MenuCycles';
import Reports from './pages/Reports';
import MenuItemDetails from './pages/MenuItemDetails';

// Import module pages
import Accountability from './pages/modules/Accountability';
import POS from './pages/modules/POS';
import Eligibility from './pages/modules/Eligibility';
import AccountManagement from './pages/modules/AccountManagement';
import ItemManagement from './pages/modules/ItemManagement';
import MenuPlanning from './pages/modules/MenuPlanning';
import Production from './pages/modules/Production';
import Inventory from './pages/modules/Inventory';
import Operations from './pages/modules/Operations';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useStore((state) => state.user);
  const { isOnline } = useNetwork();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isOnline) {
    return <Navigate to="/offline" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const setUser = useStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [setUser]);

  if (loading) {
    return <LoadingOverlay isVisible message="Initializing application..." />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent 
          loading={loading} 
          showShortcuts={showShortcuts} 
          setShowShortcuts={setShowShortcuts} 
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

const AppContent = ({ 
  loading, 
  showShortcuts, 
  setShowShortcuts 
}: { 
  loading: boolean;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
}) => {
  useKeyboardShortcuts();

  if (loading) {
    return <LoadingOverlay isVisible message="Initializing application..." />;
  }

  return (
    <>
        <ToastContainer />
        <ShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="offline" element={<OfflinePage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
            <Route index element={<Workspace />} />
            {/* Main Routes */}
            <Route path="insights" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="menu-planner" element={<ErrorBoundary><MenuPlanner /></ErrorBoundary>} />
            {/*<Route path="special-diets" element={<ErrorBoundary><SpecialDiets /></ErrorBoundary>} />*/}
            <Route path="oversight" element={<ErrorBoundary><Oversight /></ErrorBoundary>} />
            {/*<Route path="digitize" element={<ErrorBoundary><Digitize /></ErrorBoundary>} />*/}
            <Route path="reports" element={<ErrorBoundary><Reports /></ErrorBoundary>} />
            <Route path="chat" element={<ErrorBoundary><Chat /></ErrorBoundary>} />
            <Route path="settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
            <Route path="profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
            <Route path="preferences" element={<ErrorBoundary><Preferences /></ErrorBoundary>} />
          
            {/* Menu Planner Routes */}
            <Route path="menu-planner/cycles" element={<ErrorBoundary><MenuCycles /></ErrorBoundary>} />
            <Route path="menu-planner/cycles/list" element={<ErrorBoundary><MenuCyclesList /></ErrorBoundary>} />
            <Route path="menu-planner/items" element={<ErrorBoundary><MenuItems /></ErrorBoundary>} />
            <Route path="menu-planner/items/:itemId" element={<ErrorBoundary><MenuItemDetails /></ErrorBoundary>} />
            <Route path="menu-planner/cycles/:cycleId/schools" element={<ErrorBoundary><MenuCycleSchoolAnalysis /></ErrorBoundary>} />
          
            {/* Learning Routes */}
            {/*<Route path="learning" element={<ErrorBoundary><Learning /></ErrorBoundary>} />*/}
            <Route path="learning/:moduleId" element={<ErrorBoundary><LearningModule /></ErrorBoundary>} />
            <Route path="learning/resources/:id" element={<ErrorBoundary><LearningResource /></ErrorBoundary>} />
            <Route path="learning/courses" element={<ErrorBoundary><CourseList /></ErrorBoundary>} />
            <Route path="learning/courses/:courseId" element={<ErrorBoundary><CourseDetails /></ErrorBoundary>} />
            <Route path="learning/courses/:courseId/edit" element={<ErrorBoundary><CourseEdit /></ErrorBoundary>} />
            <Route path="learning/management" element={<ErrorBoundary><LearningManagement /></ErrorBoundary>} />
            {/*<Route path="financials" element={<ErrorBoundary><Financials /></ErrorBoundary>} />*/}

            {/* Module routes */}
            <Route path="modules/accountability" element={<ErrorBoundary><Accountability /></ErrorBoundary>} />
            <Route path="modules/pos" element={<ErrorBoundary><POS /></ErrorBoundary>} />
            <Route path="modules/eligibility" element={<ErrorBoundary><Eligibility /></ErrorBoundary>} />
            <Route path="modules/account-management" element={<ErrorBoundary><AccountManagement /></ErrorBoundary>} />
            <Route path="modules/item-management" element={<ErrorBoundary><ItemManagement /></ErrorBoundary>} />
            <Route path="modules/menu-planning" element={<ErrorBoundary><MenuPlanning /></ErrorBoundary>} />
            <Route path="modules/production" element={<ErrorBoundary><Production /></ErrorBoundary>} />
            <Route path="modules/inventory" element={<ErrorBoundary><Inventory /></ErrorBoundary>} />
            <Route path="modules/operations" element={<ErrorBoundary><Operations /></ErrorBoundary>} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
    </>
  );
};

export default App;