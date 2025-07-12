import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      setLocation("/dashboard");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Welcome to ReWear
          </CardTitle>
          <p className="text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            size="lg"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{" "}
              <a href="#" className="text-primary hover:text-primary/80">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:text-primary/80">
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
