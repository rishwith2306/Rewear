import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Plus, 
  MessageSquare, 
  Heart, 
  Settings, 
  ShoppingBag, 
  Tag, 
  DollarSign, 
  Star,
  UserCog
} from "lucide-react";
import type { Product, Order } from "@shared/schema";

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  
  // Mock user data - in real app this would come from auth context
  const mockUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profileImageUrl: "",
    rating: "4.8",
    reviewCount: 127,
    memberSince: "2023"
  };

  const { data: userProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { sellerId: mockUser.id }],
    queryFn: async () => {
      const response = await fetch(`/api/products?sellerId=${mockUser.id}`);
      if (!response.ok) throw new Error("Failed to fetch user products");
      return response.json();
    },
  });

  const { data: userOrders = [] } = useQuery<Order[]>({
    queryKey: ["/api/users", mockUser.id, "orders"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${mockUser.id}/orders`);
      if (!response.ok) throw new Error("Failed to fetch user orders");
      return response.json();
    },
  });

  const { data: userFavorites = [] } = useQuery<Product[]>({
    queryKey: ["/api/users", mockUser.id, "favorites"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${mockUser.id}/favorites`);
      if (!response.ok) throw new Error("Failed to fetch favorites");
      return response.json();
    },
  });

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "listings", label: "My Listings", icon: Tag },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const totalSales = userOrders
    .filter(order => order.sellerId === mockUser.id && order.status === "completed")
    .reduce((sum, order) => sum + parseFloat(order.amount), 0);

  const activeListings = userProducts.filter(product => product.status === "active").length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your listings, orders, and profile</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mockUser.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {mockUser.firstName[0]}{mockUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {mockUser.firstName} {mockUser.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Member since {mockUser.memberSince}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                          activeSection === item.id
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {activeSection === "overview" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active Listings</p>
                          <p className="text-2xl font-bold text-gray-900">{activeListings}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Tag className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Sales</p>
                          <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Rating</p>
                          <div className="flex items-center space-x-1">
                            <p className="text-2xl font-bold text-gray-900">{mockUser.rating}</p>
                            <div className="flex text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Star className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
                        <Plus className="h-6 w-6 text-primary" />
                        <span className="font-medium">Add New Listing</span>
                      </Button>
                      <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        <span className="font-medium">Check Messages</span>
                      </Button>
                      <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <span className="font-medium">View Analytics</span>
                      </Button>
                      <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
                        <UserCog className="h-6 w-6 text-primary" />
                        <span className="font-medium">Edit Profile</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">Your item "Vintage Denim Jacket" was sold</p>
                          <p className="text-sm text-gray-500">2 hours ago</p>
                        </div>
                        <span className="text-green-600 font-semibold">+$45</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">New message from Sarah about "Black Evening Dress"</p>
                          <p className="text-sm text-gray-500">5 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">You received a 5-star review from Mike</p>
                          <p className="text-sm text-gray-500">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Listings Preview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>My Active Listings</CardTitle>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveSection("listings")}
                    >
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {userProducts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No active listings yet.</p>
                        <Button className="mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Listing
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userProducts.slice(0, 3).map((product) => {
                          const imageUrl = product.imageUrls?.[0] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop";
                          return (
                            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                              <div className="aspect-square overflow-hidden rounded-lg mb-3">
                                <img 
                                  src={imageUrl} 
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h3 className="font-medium text-gray-900 mb-1">{product.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Size {product.size} • ${parseFloat(product.price).toFixed(2)}
                              </p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-green-600">{product.viewCount || 0} views</span>
                                <span className="text-gray-500">
                                  {new Date(product.createdAt!).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "listings" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Listings management interface would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Orders management interface would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "messages" && (
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Messages interface would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "favorites" && (
              <Card>
                <CardHeader>
                  <CardTitle>Favorites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Favorites interface would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Settings interface would go here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
