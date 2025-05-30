import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// onAuthenticated gets called when someone logs in
interface AuthProps {
  onAuthenticated: () => void;
}

// Callback function
export function Auth({ onAuthenticated }: AuthProps) {
    // Initialize state variables
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if already authenticated on component mount (session storage)
  // If we find "authenticated", user is good, else they are not.
  useEffect(() => {
    const stored = sessionStorage.getItem("pebble-auth");
    if (stored === "authenticated") {
      onAuthenticated();
      return;
    }
    setLoading(false);
  }, [onAuthenticated]);  // run this again if onAuthenticated

  // Login handler that compares input password to set one
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_PASSWORD) {
      sessionStorage.setItem("pebble-auth", "authenticated");
      setPassword(""); // Clear password
      onAuthenticated();
    } else {
      alert("Incorrect password");
      setPassword("");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // The actual login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Pebble Personal Finance</CardTitle>
          <CardDescription>
            Enter password to access your financial data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
            <Button type="submit" className="w-full">
              Access App
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
