import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Shield, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Give Your Clothes <span className="text-primary">New Life</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our sustainable fashion community. Buy, sell, and exchange pre-loved clothing to reduce waste and discover unique styles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="px-8 py-3">
                  Start Exchanging
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Browse Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ReWear?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform makes sustainable fashion accessible, affordable, and enjoyable for everyone.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable</h3>
              <p className="text-gray-600">
                Reduce fashion waste by giving clothes a second life in our circular economy.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted</h3>
              <p className="text-gray-600">
                Verified users, secure payments, and quality guarantees for worry-free exchanges.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Connect with fashion lovers who share your values and style preferences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-gray-600">Items Exchanged</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5,200+</div>
              <div className="text-gray-600">Happy Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">8.2 tons</div>
              <div className="text-gray-600">Waste Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
