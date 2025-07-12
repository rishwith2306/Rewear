import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Plus, Package, Heart, MessageCircle, Star, Settings, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  images: string[];
  status: string;
  views: number;
  favorites: number;
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  product: {
    title: string;
    images: string[];
    price: number;
  };
  status: string;
  totalAmount: number;
  createdAt: string;
}

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoadingData(true);
      // For now, we'll use mock data since the API endpoints need user ID mapping
      // In a real implementation, you'd fetch from your API
      setUserProducts([]);
      setUserOrders([]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback className="text-lg">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.displayName}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">4.8 (24 reviews)</span>
              </div>
              <Badge variant="secondary">Active Seller</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/add-product">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Sell Item
            </Button>
          </Link>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userProducts.length}</div>
                <p className="text-xs text-muted-foreground">Products for sale</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userOrders.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Saved items</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions on ReWear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No recent activity</p>
                <p className="text-sm">Start selling items to see your activity here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Products</h2>
              <p className="text-gray-600">Manage your listed items</p>
            </div>
            <Link href="/add-product">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {userProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No products listed yet</h3>
                <p className="text-gray-600 mb-4">Start selling by adding your first product</p>
                <Link href="/add-product">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProducts.map((product) => (
                <Card key={product._id}>
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                      {product.images[0] && (
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <p className="text-2xl font-bold text-primary mb-2">${product.price}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <Badge variant={product.status === 'available' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                      <span>{product.views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Orders</h2>
            <p className="text-gray-600">Track your purchases and sales</p>
          </div>

          {userOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                <Link href="/browse">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <Card key={order._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg">
                          {order.product.images[0] && (
                            <img 
                              src={order.product.images[0]} 
                              alt={order.product.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{order.product.title}</h3>
                          <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${order.totalAmount}</p>
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Favorites</h2>
            <p className="text-gray-600">Items you've saved for later</p>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-4">Save items you love to find them easily later</p>
              <Link href="/browse">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Messages</h2>
            <p className="text-gray-600">Chat with buyers and sellers</p>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-4">Start a conversation with other users</p>
              <Link href="/browse">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
