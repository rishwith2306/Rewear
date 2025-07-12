import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Tag, 
  DollarSign, 
  AlertTriangle, 
  UserPlus, 
  Flag, 
  CheckCircle,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  Ban,
  UnlockKeyhole,
  Search
} from "lucide-react";
import type { User, Product } from "@shared/schema";

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real data from APIs
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Calculate real stats from data
  const adminStats = {
    totalUsers: users.length,
    userGrowth: 12, // This would be calculated from historical data
    activeListings: products.filter(p => p.status === "active").length,
    listingGrowth: 8, // This would be calculated from historical data
    monthlyRevenue: products.reduce((sum, p) => sum + (p.price || 0), 0),
    revenueGrowth: 15, // This would be calculated from historical data
    pendingReports: 3 // This would come from reports API
  };

  // Mutations for admin actions
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: number; action: "ban" | "unban" }) => {
      return apiRequest(`/api/admin/users/${userId}/${action}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      return apiRequest(`/api/products/${productId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const updateProductStatusMutation = useMutation({
    mutationFn: async ({ productId, status }: { productId: number; status: string }) => {
      return apiRequest(`/api/products/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Success",
        description: "Product status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    },
  });

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "listings", label: "Listing Management", icon: Tag },
    { id: "reports", label: "Reports & Moderation", icon: Flag, badge: adminStats.pendingReports },
    { id: "settings", label: "Platform Settings", icon: Settings },
  ];

  // Filter users and products based on search and filters
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const recentActivity = [
    {
      id: 1,
      type: "user_registration",
      title: "New user registration: emma.jones@email.com",
      time: "5 minutes ago",
      icon: UserPlus,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      id: 2,
      type: "report",
      title: 'Listing reported: "Vintage Leather Bag" by user_id_1247',
      time: "15 minutes ago",
      icon: Flag,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      action: true
    },
    {
      id: 3,
      type: "payment",
      title: "Payment processed: $89.50 transaction completed",
      time: "30 minutes ago",
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Platform management and analytics</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{adminStats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{adminStats.userGrowth}% this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{adminStats.activeListings.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{adminStats.listingGrowth}% this week</p>
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
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${adminStats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{adminStats.revenueGrowth}% this month</p>
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
                  <p className="text-sm text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{adminStats.pendingReports}</p>
                  <p className="text-sm text-red-600">Needs attention</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Admin Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Admin Tools</h3>
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

          {/* Admin Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dashboard Section */}
            {activeSection === "dashboard" && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Platform Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                          <div className={`w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                          {activity.action && (
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Management Section */}
            {activeSection === "users" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              Loading users...
                            </TableCell>
                          </TableRow>
                        ) : filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.profileImageUrl || undefined} />
                                    <AvatarFallback>
                                      {user.firstName?.[0] || user.username[0]}{user.lastName?.[0] || user.username[1]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                                    </div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.isAdmin ? "default" : "secondary"}>
                                  {user.isAdmin ? "Admin" : "Active"}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(user.createdAt!).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">{user.rating}</span>
                                  <span className="text-xs text-gray-500 ml-1">({user.reviewCount} reviews)</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => toggleUserStatusMutation.mutate({ userId: user.id, action: "ban" })}
                                    disabled={toggleUserStatusMutation.isPending}
                                  >
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Listing Management Section */}
            {activeSection === "listings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Listing Management</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Seller</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productsLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              Loading products...
                            </TableCell>
                          </TableRow>
                        ) : filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              No products found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                    <Tag className="h-6 w-6 text-gray-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{product.title}</div>
                                    <div className="text-sm text-gray-500">Size: {product.size} • {product.condition}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">Seller ID: {product.sellerId}</div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">${product.price}</div>
                                {product.originalPrice && (
                                  <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  product.status === "active" ? "default" :
                                  product.status === "sold" ? "secondary" :
                                  "outline"
                                }>
                                  {product.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{product.viewCount}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => deleteProductMutation.mutate(product.id)}
                                    disabled={deleteProductMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reports Section */}
            {activeSection === "reports" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Reports & Moderation</h2>
                <Card>
                  <CardContent className="p-8 text-center">
                    <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Pending</h3>
                    <p className="text-gray-500">All reports have been reviewed and resolved.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
                <Card>
                  <CardContent className="p-8 text-center">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
                    <p className="text-gray-500">Platform configuration options coming soon.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
