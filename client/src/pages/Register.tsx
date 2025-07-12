import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

export default function Register() {
  const { user, signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Join ReWear</CardTitle>
          <CardDescription className="text-center">
            Create your account to start buying and selling pre-loved fashion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            size="lg"
          >
            <Chrome className="h-5 w-5" />
            Sign up with Google
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium"
              onClick={() => setLocation("/login")}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}