import { 
  users, 
  products, 
  categories, 
  orders, 
  messages, 
  favorites, 
  reviews,
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type Message,
  type InsertMessage,
  type Favorite,
  type InsertFavorite,
  type Review,
  type InsertReview,
  type Category
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Products
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(filters?: {
    categoryId?: number;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  incrementProductViews(id: number): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;

  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Messages
  getUserMessages(userId: number): Promise<Message[]>;
  getConversation(userId1: number, userId2: number, productId?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<void>;

  // Favorites
  getUserFavorites(userId: number): Promise<Product[]>;
  addToFavorites(favorite: InsertFavorite): Promise<Favorite>;
  removeFromFavorites(userId: number, productId: number): Promise<boolean>;
  isFavorited(userId: number, productId: number): Promise<boolean>;

  // Reviews
  getUserReviews(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private products: Map<number, Product> = new Map();
  private categories: Map<number, Category> = new Map();
  private orders: Map<number, Order> = new Map();
  private messages: Map<number, Message> = new Map();
  private favorites: Map<number, Favorite> = new Map();
  private reviews: Map<number, Review> = new Map();
  
  private currentUserId = 1;
  private currentProductId = 1;
  private currentOrderId = 1;
  private currentMessageId = 1;
  private currentFavoriteId = 1;
  private currentReviewId = 1;

  constructor() {
    // Initialize with some categories
    this.categories.set(1, { id: 1, name: "Tops", description: "Shirts, blouses, sweaters" });
    this.categories.set(2, { id: 2, name: "Dresses", description: "Casual and formal dresses" });
    this.categories.set(3, { id: 3, name: "Pants", description: "Jeans, trousers, leggings" });
    this.categories.set(4, { id: 4, name: "Shoes", description: "Sneakers, boots, heels" });
    this.categories.set(5, { id: 5, name: "Accessories", description: "Bags, jewelry, scarves" });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      rating: "0.0",
      reviewCount: 0,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(filters: {
    categoryId?: number;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: number;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.condition) {
      products = products.filter(p => p.condition === filters.condition);
    }
    if (filters.minPrice) {
      products = products.filter(p => parseFloat(p.price) >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      products = products.filter(p => parseFloat(p.price) <= filters.maxPrice!);
    }
    if (filters.sellerId) {
      products = products.filter(p => p.sellerId === filters.sellerId);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.brand?.toLowerCase().includes(search)
      );
    }

    // Sort by newest first
    products.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    const offset = filters.offset || 0;
    const limit = filters.limit || 20;
    return products.slice(offset, offset + limit);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      categoryId: insertProduct.categoryId || null,
      originalPrice: insertProduct.originalPrice || null,
      brand: insertProduct.brand || null,
      color: insertProduct.color || null,
      material: insertProduct.material || null,
      imageUrls: insertProduct.imageUrls || null,
      status: "active",
      viewCount: 0,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async incrementProductViews(id: number): Promise<void> {
    const product = this.products.get(id);
    if (product) {
      product.viewCount = (product.viewCount || 0) + 1;
      this.products.set(id, product);
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => 
      order.buyerId === userId || order.sellerId === userId
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    order.status = status;
    order.updatedAt = new Date();
    this.orders.set(id, order);
    return order;
  }

  // Messages
  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(message => 
      message.senderId === userId || message.receiverId === userId
    );
  }

  async getConversation(userId1: number, userId2: number, productId?: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(message => {
      const isConversation = 
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1);
      
      if (productId) {
        return isConversation && message.productId === productId;
      }
      return isConversation;
    });
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      productId: insertMessage.productId || null,
      isRead: false,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      message.isRead = true;
      this.messages.set(id, message);
    }
  }

  // Favorites
  async getUserFavorites(userId: number): Promise<Product[]> {
    const userFavorites = Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
    const productIds = userFavorites.map(fav => fav.productId);
    return productIds.map(id => this.products.get(id)).filter(Boolean) as Product[];
  }

  async addToFavorites(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = {
      ...insertFavorite,
      id,
      createdAt: new Date(),
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFromFavorites(userId: number, productId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(fav => 
      fav.userId === userId && fav.productId === productId
    );
    if (favorite) {
      return this.favorites.delete(favorite.id);
    }
    return false;
  }

  async isFavorited(userId: number, productId: number): Promise<boolean> {
    return Array.from(this.favorites.values()).some(fav => 
      fav.userId === userId && fav.productId === productId
    );
  }

  // Reviews
  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.revieweeId === userId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...insertReview,
      id,
      comment: insertReview.comment || null,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }
}

export const storage = new MemStorage();
