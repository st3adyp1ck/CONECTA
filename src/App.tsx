import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./components/home";
import AdminDashboard from "./pages/admin";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import ConfirmationSuccessPage from "./pages/confirmation-success";
import { Toaster } from "./components/ui/toaster";
import { BackgroundAnimation } from "./components/BackgroundAnimation";
import { Preloader } from "./components/Preloader";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { useAppLoading } from "./lib/useAppLoading";
import routes from "tempo-routes";

function App() {
  const { } = useAppLoading({
    minLoadTime: 3000, // Minimum time to show the preloader
    initialDelay: 300  // Small delay before starting to simulate progress
  });

  // State to track if content should be visible
  const [showContent, setShowContent] = useState(false);

  // Handle preloader completion
  const handleLoadingComplete = () => {
    // Show content with a small delay after preloader is gone
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  // Preload critical assets
  useEffect(() => {
    // Preload images, fonts, or other assets here if needed
    const preloadAssets = async () => {
      // Example: preload logo or background images
      // const imageUrls = ['/logo.png', '/background.jpg'];
      // await Promise.all(imageUrls.map(url => {
      //   return new Promise((resolve) => {
      //     const img = new Image();
      //     img.onload = resolve;
      //     img.src = url;
      //   });
      // }));
    };

    preloadAssets();
  }, []);

  return (
    <>
      {/* Main preloader */}
      <Preloader onLoadingComplete={handleLoadingComplete} />

      {/* Main application content */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner" />
          <div className="ml-3 flex space-x-1">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        </div>
      }>
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <BackgroundAnimation
                density="medium"
                speed="medium"
                interactive={true}
                intensityLevel="intense"
              />

              <AnimatePresence mode="wait">
                <AuthProvider>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/confirmation-success" element={<ConfirmationSuccessPage />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </AuthProvider>
              </AnimatePresence>

              {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
              <Toaster />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
}

export default App;

