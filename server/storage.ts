import { 
  User, 
  InsertUser, 
  Book, 
  InsertBook, 
  CartItem, 
  InsertCartItem, 
  Order, 
  InsertOrder, 
  OrderItem, 
  InsertOrderItem 
} from "@shared/schema";
import { demoBooks } from "../client/src/lib/demoData";

// Storage interface with all required CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined> | User | undefined;
  getUserByUsername(username: string): Promise<User | undefined> | User | undefined;
  getUserByEmail(email: string): Promise<User | undefined> | User | undefined;
  createUser(user: InsertUser): Promise<User> | User;
  
  // Book methods
  getAllBooks(): Promise<Book[]> | Book[];
  getBookById(id: number): Promise<Book | undefined> | Book | undefined;
  getBooksByCategory(category: string): Promise<Book[]> | Book[];
  getFeaturedBooks(): Promise<Book[]> | Book[];
  getNewReleases(): Promise<Book[]> | Book[];
  searchBooks(query: string): Promise<Book[]> | Book[];
  addBook(book: InsertBook): Promise<Book> | Book;
  updateBook(book: Book): Promise<Book> | Book;
  deleteBook(id: number): Promise<void> | void;
  
  // Cart methods
  getCartByUserId(userId: string): Promise<CartItem[]> | CartItem[];
  addToCart(cartItem: InsertCartItem): Promise<CartItem> | CartItem;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> | CartItem | undefined;
  removeFromCart(id: number): Promise<void> | void;
  clearCart(userId: string): Promise<void> | void;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order> | Order;
  createOrderItems(orderItems: InsertOrderItem[]): Promise<OrderItem[]> | OrderItem[];
  getOrdersByUserId(userId: string): Promise<Order[]> | Order[];
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> | OrderItem[];
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  private userIdCounter: number;
  private bookIdCounter: number;
  private cartItemIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.userIdCounter = 1;
    this.bookIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    
    // Initialize with default users
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@bookshelf.com",
      isAdmin: true,
    });
    
    this.createUser({
      username: "user",
      password: "user123",
      email: "user@example.com",
      isAdmin: false,
    });
    
    // Initialize with demo books
    demoBooks.forEach(book => {
      this.books.set(this.bookIdCounter++, book);
    });
  }

  // User methods
  getUser(id: number): User | undefined {
    return this.users.get(id);
  }

  getUserByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  createUser(insertUser: InsertUser): User {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Book methods
  getAllBooks(): Book[] {
    return Array.from(this.books.values());
  }
  
  getBookById(id: number): Book | undefined {
    return this.books.get(id);
  }
  
  getBooksByCategory(category: string): Book[] {
    return Array.from(this.books.values()).filter(
      (book) => book.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  getFeaturedBooks(): Book[] {
    return Array.from(this.books.values()).filter(
      (book) => book.featured
    );
  }
  
  getNewReleases(): Book[] {
    return Array.from(this.books.values()).filter(
      (book) => book.newRelease
    );
  }
  
  searchBooks(query: string): Book[] {
    const lowerCaseQuery = query.toLowerCase();
    return Array.from(this.books.values()).filter(
      (book) => 
        book.title.toLowerCase().includes(lowerCaseQuery) || 
        book.author.toLowerCase().includes(lowerCaseQuery)
    );
  }
  
  addBook(book: InsertBook): Book {
    const id = this.bookIdCounter++;
    const newBook: Book = { ...book, id };
    this.books.set(id, newBook);
    return newBook;
  }
  
  updateBook(book: Book): Book {
    if (this.books.has(book.id)) {
      this.books.set(book.id, book);
      return book;
    }
    throw new Error(`Book with ID ${book.id} not found`);
  }
  
  deleteBook(id: number): void {
    this.books.delete(id);
  }
  
  // Cart methods
  getCartByUserId(userId: string): CartItem[] {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  addToCart(cartItem: InsertCartItem): CartItem {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.userId === cartItem.userId && item.bookId === cartItem.bookId
    );
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += cartItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Add new item
      const id = this.cartItemIdCounter++;
      const newCartItem: CartItem = { 
        ...cartItem, 
        id, 
        addedAt: new Date().toISOString() 
      };
      this.cartItems.set(id, newCartItem);
      return newCartItem;
    }
  }
  
  updateCartItem(id: number, quantity: number): CartItem | undefined {
    const cartItem = this.cartItems.get(id);
    
    if (cartItem) {
      cartItem.quantity = quantity;
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
    
    return undefined;
  }
  
  removeFromCart(id: number): void {
    this.cartItems.delete(id);
  }
  
  clearCart(userId: string): void {
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter((item) => item.userId === userId)
      .map((item) => item.id);
    
    itemsToRemove.forEach((id) => this.cartItems.delete(id));
  }
  
  // Order methods
  createOrder(order: InsertOrder): Order {
    const id = this.orderIdCounter++;
    const newOrder: Order = { 
      ...order, 
      id, 
      createdAt: new Date().toISOString() 
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  createOrderItems(orderItems: InsertOrderItem[]): OrderItem[] {
    const createdItems: OrderItem[] = [];
    
    orderItems.forEach((item) => {
      const id = this.orderItemIdCounter++;
      const newItem: OrderItem = { ...item, id };
      this.orderItems.set(id, newItem);
      createdItems.push(newItem);
      
      // Update book stock
      const book = this.books.get(item.bookId);
      if (book) {
        book.stock = Math.max(0, book.stock - item.quantity);
        this.books.set(book.id, book);
      }
    });
    
    return createdItems;
  }
  
  getOrdersByUserId(userId: string): Order[] {
    return Array.from(this.orders.values())
      .filter((order) => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  getOrderItemsByOrderId(orderId: number): OrderItem[] {
    return Array.from(this.orderItems.values())
      .filter((item) => item.orderId === orderId);
  }
}

export const storage = new MemStorage();
