// This page is now redirected to Home component in App.tsx
// This is just a fallback

import { Navigate } from "react-router-dom";

const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
