import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all books
  app.get("/api/books", (req, res) => {
    const books = storage.getAllBooks();
    res.json(books);
  });
  
  // Get a single book by ID
  app.get("/api/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = storage.getBookById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.json(book);
  });
  
  // Get books by category
  app.get("/api/books/category/:category", (req, res) => {
    const category = req.params.category;
    let books;
    
    if (category === "all") {
      books = storage.getAllBooks();
    } else if (category === "featured") {
      books = storage.getFeaturedBooks();
    } else if (category === "new-release") {
      books = storage.getNewReleases();
    } else {
      books = storage.getBooksByCategory(category);
    }
    
    res.json(books);
  });
  
  // Search books
  app.get("/api/books/search/:query", (req, res) => {
    const query = req.params.query;
    const books = storage.searchBooks(query);
    res.json(books);
  });
  
  // User authentication
  app.post("/api/users/login", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  });
  
  // Register new user
  app.post("/api/users/register", (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }
    
    // Check if username or email already exists
    const existingUser = storage.getUserByUsername(username);
    const existingEmail = storage.getUserByEmail(email);
    
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }
    
    const newUser = storage.createUser({
      username,
      email,
      password,
      isAdmin: false,
    });
    
    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json(userWithoutPassword);
  });
  
  // Add a book to cart
  app.post("/api/cart", (req, res) => {
    const { userId, bookId, quantity } = req.body;
    
    if (!userId || !bookId || !quantity) {
      return res.status(400).json({ message: "User ID, book ID, and quantity are required" });
    }
    
    const cartItem = storage.addToCart({
      userId,
      bookId,
      quantity,
    });
    
    res.status(201).json(cartItem);
  });
  
  // Get user's cart
  app.get("/api/cart/:userId", (req, res) => {
    const userId = req.params.userId;
    const cartItems = storage.getCartByUserId(userId);
    res.json(cartItems);
  });
  
  // Update cart item quantity
  app.patch("/api/cart/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const { quantity } = req.body;
    
    if (!quantity) {
      return res.status(400).json({ message: "Quantity is required" });
    }
    
    const updatedItem = storage.updateCartItem(itemId, quantity);
    
    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    res.json(updatedItem);
  });
  
  // Remove item from cart
  app.delete("/api/cart/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    storage.removeFromCart(itemId);
    res.status(204).end();
  });
  
  // Clear user's cart
  app.delete("/api/cart/user/:userId", (req, res) => {
    const userId = req.params.userId;
    storage.clearCart(userId);
    res.status(204).end();
  });
  
  // Create order
  app.post("/api/orders", (req, res) => {
    const { userId, total } = req.body;
    
    if (!userId || total === undefined) {
      return res.status(400).json({ message: "User ID and total are required" });
    }
    
    const order = storage.createOrder({
      userId,
      total,
      status: "pending",
    });
    
    res.status(201).json(order);
  });
  
  // Create order items
  app.post("/api/order-items", (req, res) => {
    const orderItems = req.body;
    
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }
    
    const createdItems = storage.createOrderItems(orderItems);
    res.status(201).json(createdItems);
  });
  
  // Get user's orders
  app.get("/api/orders/:userId", (req, res) => {
    const userId = req.params.userId;
    const orders = storage.getOrdersByUserId(userId);
    res.json(orders);
  });
  
  // Get order items for an order
  app.get("/api/order-items/:orderId", (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const orderItems = storage.getOrderItemsByOrderId(orderId);
    res.json(orderItems);
  });
  
  // Admin routes for book management
  
  // Add a new book
  app.post("/api/admin/books", (req, res) => {
    const bookData = req.body;
    
    if (!bookData.title || !bookData.author || !bookData.price) {
      return res.status(400).json({ message: "Title, author, and price are required" });
    }
    
    const newBook = storage.addBook(bookData);
    res.status(201).json(newBook);
  });
  
  // Update a book
  app.patch("/api/admin/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookData = req.body;
    
    const updatedBook = storage.updateBook({ id: bookId, ...bookData });
    
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.json(updatedBook);
  });
  
  // Delete a book
  app.delete("/api/admin/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    storage.deleteBook(bookId);
    res.status(204).end();
  });

  const httpServer = createServer(app);

  return httpServer;
}
