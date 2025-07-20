import React, { lazy, ReactNode, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "../components/Loader";
import ProtectedRoute from "../components/ProtectedRoute";
import PageNotFound from "../components/ErrorBoundary/PageNotFound";

// Lazy-loaded pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../auth/Login"));
const Register = lazy(() => import("../auth/Register"));


interface ErrorBoundaryWrapperProps {
    children: ReactNode;
}

class ErrorBoundaryWrapper extends React.Component<ErrorBoundaryWrapperProps> {
    state = { hasError: false };
  
    static getDerivedStateFromError(_: any) {
      return { hasError: true };
    }
  
    componentDidCatch(error: any, errorInfo: any) {
      console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <div>Something went wrong.</div>; // or your PageNotFound
      }
      return this.props.children;
    }
  }

export default function RouterList() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ========== Authentication Pages ========== */}
        <Route
          path="/"
          element={
            <ErrorBoundaryWrapper>
              <Login />
            </ErrorBoundaryWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <ErrorBoundaryWrapper>
              <Register />
            </ErrorBoundaryWrapper>
          }
        />

        {/* ========== Protected Dashboard ========== */}
        <Route
          path="/dashboard"
          element={
            <ErrorBoundaryWrapper>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </ErrorBoundaryWrapper>
          }
        />

        {/* ========== Catch All ========== */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}
