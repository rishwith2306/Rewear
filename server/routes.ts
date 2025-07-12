import type { Express } from "express";
import { createServer, type Server } from "http";
import dbConnect from "./db/connection";
import { User } from "./db/models/User";
import { Product } from "./db/models/Product";
import { Order } from "./db/models/Order";
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertMessageSchema, insertFavoriteSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";
import { adminAuth } from "./firebase-admin";

// Authentication middleware
async function authenticateUser(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Find user in database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(401).json({ message: "User not found in database" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid authentication token" });
  }
}

// Optional authentication middleware (doesn't fail if no token)
async function optionalAuth(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await adminAuth.verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      req.user = user;
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await dbConnect();

  // Firebase Auth route - sync user with database
  app.post("/api/auth/firebase", async (req, res) => {
    try {
      const { uid, email, displayName, photoURL } = req.body;
      
      if (!uid || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user exists
      let user = await User.findOne({ firebaseUid: uid });
      
      if (!user) {
        // Create new user
        user = new User({
          firebaseUid: uid,
          email,
          displayName,
          photoURL,
          firstName: displayName?.split(' ')[0] || null,
          lastName: displayName?.split(' ').slice(1).join(' ') || null,
        });
        await user.save();
      } else {
        // Update existing user
        user.email = email;
        user.displayName = displayName;
        user.photoURL = photoURL;
        await user.save();
      }

      res.json({
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      console.error("Firebase auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Legacy auth routes (deprecated but kept for compatibility)
  app.post("/api/auth/register", async (req, res) => {
    res.status(410).json({ message: "Please use Google Sign-In instead" });
  });

  app.post("/api/auth/login", async (req, res) => {
    res.status(410).json({ message: "Please use Google Sign-In instead" });
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const {
        category,
        condition,
        minPrice,
        maxPrice,
        sellerId,
        search,
        limit = "20",
        offset = "0"
      } = req.query;

      let query: any = { status: 'available' };

      if (category) query.category = category;
      if (condition) query.condition = condition;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice as string);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
      }
      if (sellerId) query.seller = sellerId;
      if (search) {
        query.$text = { $search: search as string };
      }

      const products = await Product.find(query)
        .populate('seller', 'displayName photoURL rating reviewCount')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit as string))
        .skip(parseInt(offset as string));

      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findById(id).populate('seller', 'displayName photoURL rating reviewCount');
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Increment view count
      await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });
      
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", authenticateUser, async (req, res) => {
    try {
      const productData = {
        ...req.body,
        seller: req.body.sellerId, // Assuming sellerId is passed in request
      };
      const product = new Product(productData);
      await product.save();
      res.json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const product = await Product.findByIdAndUpdate(id, updates, { new: true });
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findByIdAndUpdate(id, { status: 'deleted' });
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = [
        { id: 1, name: "Tops", description: "Shirts, blouses, sweaters" },
        { id: 2, name: "Dresses", description: "Casual and formal dresses" },
        { id: 3, name: "Pants", description: "Jeans, trousers, leggings" },
        { id: 4, name: "Shoes", description: "Sneakers, boots, heels" },
        { id: 5, name: "Accessories", description: "Bags, jewelry, scarves" },
      ];
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const allUsers = await User.find().select('-__v');
      res.json(allUsers);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id).select('-__v');
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Orders - simplified for now
  app.post("/api/orders", authenticateUser, async (req, res) => {
    try {
      const orderData = {
        ...req.body,
        orderNumber: nanoid(10),
        buyer: req.body.buyerId,
        seller: req.body.sellerId,
        product: req.body.productId,
      };
      const order = new Order(orderData);
      await order.save();
      res.json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.get("/api/users/:id/orders", async (req, res) => {
    try {
      const userId = req.params.id;
      const orders = await Order.find({ $or: [{ buyer: userId }, { seller: userId }] })
        .populate('product', 'title images price')
        .populate('buyer', 'displayName email')
        .populate('seller', 'displayName email');
      res.json(orders);
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Simplified endpoints for features to be implemented later
  app.post("/api/messages", authenticateUser, async (req, res) => {
    res.status(501).json({ message: "Messages feature coming soon" });
  });

  app.get("/api/users/:id/messages", async (req, res) => {
    res.status(501).json({ message: "Messages feature coming soon" });
  });

  app.post("/api/favorites", authenticateUser, async (req, res) => {
    res.status(501).json({ message: "Favorites feature coming soon" });
  });

  app.delete("/api/favorites/:userId/:productId", async (req, res) => {
    res.status(501).json({ message: "Favorites feature coming soon" });
  });

  app.get("/api/users/:id/favorites", async (req, res) => {
    res.status(501).json({ message: "Favorites feature coming soon" });
  });

  app.post("/api/reviews", authenticateUser, async (req, res) => {
    res.status(501).json({ message: "Reviews feature coming soon" });
  });

  app.get("/api/users/:id/reviews", async (req, res) => {
    res.status(501).json({ message: "Reviews feature coming soon" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
