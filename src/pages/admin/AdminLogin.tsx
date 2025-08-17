import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/store/adminStore";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
const AdminLogin = () => {
  const {
    isAuthenticated,
    login,
    logout
  } = useAdminStore();
  const {
    toast
  } = useToast();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  // Always ensure user is logged out when accessing login page
  React.useEffect(() => {
    logout();
    localStorage.clear(); // Clear all localStorage data
    sessionStorage.clear(); // Clear all sessionStorage data
  }, [logout]);
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(credentials.username, credentials.password)) {
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel."
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive"
      });
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  return <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <p className="text-muted-foreground">
            Access the IB Electric Store admin panel
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" required value={credentials.username} onChange={handleInputChange} placeholder="Enter username" />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required value={credentials.password} onChange={handleInputChange} placeholder="Enter password" />
            </div>
            
            <Button type="submit" variant="store" className="w-full">
              Login
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            
            
            <div className="mt-4">
              <p className="text-xs text-muted-foreground font-medium">
                Private
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default AdminLogin;