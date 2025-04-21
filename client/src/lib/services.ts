import { Book, User, CartItem, Order, OrderItem } from '@shared/schema';

// Local storage keys
const BOOKS_KEY = 'bookshelf_books';
const USERS_KEY = 'bookshelf_users';
const CURRENT_USER_KEY = 'bookshelf_current_user';
const CART_ITEMS_KEY = 'bookshelf_cart_items';
const ORDERS_KEY = 'bookshelf_orders';
const ORDER_ITEMS_KEY = 'bookshelf_order_items';

// Initialize local storage with demo data if empty
export const initializeLocalStorage = (books: Book[]) => {
  if (!localStorage.getItem(BOOKS_KEY)) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }
  
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers: User[] = [
      { id: 1, username: 'admin', password: 'admin123', email: 'admin@bookshelf.com', isAdmin: true },
      { id: 2, username: 'user', password: 'user123', email: 'user@example.com', isAdmin: false },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem(CART_ITEMS_KEY)) {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(ORDER_ITEMS_KEY)) {
    localStorage.setItem(ORDER_ITEMS_KEY, JSON.stringify([]));
  }
};

// Books service
export const bookService = {
  getAll: (): Book[] => {
    return JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  },
  
  getById: (id: number): Book | undefined => {
    const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    return books.find((book: Book) => book.id === id);
  },
  
  getByCategory: (category: string): Book[] => {
    const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    if (category === 'all') return books;
    return books.filter((book: Book) => book.category === category);
  },
  
  getFeatured: (): Book[] => {
    const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    return books.filter((book: Book) => book.featured);
  },
  
  getNewReleases: (): Book[] => {
    const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    return books.filter((book: Book) => book.newRelease);
  },
  
  addBook: (book: Omit<Book, 'id'>): Book => {
    const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    const newBook = { ...book, id: books.length > 0 ? Math.max(...books.map((b: Book) => b.id)) + 1 : 1 };
    localStorage.setItem(BOOKS_KEY, JSON.stringify([...books, newBook]));
    return newBook;
  },
  
  updateBook: (book: Book): Book => {
    const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    const updatedBooks = books.map((b: Book) => b.id === book.id ? book : b);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(updatedBooks));
    return book;
  },
  
  deleteBook: (id: number): void => {
    const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    const filteredBooks = books.filter((book: Book) => book.id !== id);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(filteredBooks));
  },
  
  searchBooks: (query: string): Book[] => {
    const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
    const lowerCaseQuery = query.toLowerCase();
    return books.filter((book: Book) => 
      book.title.toLowerCase().includes(lowerCaseQuery) || 
      book.author.toLowerCase().includes(lowerCaseQuery)
    );
  }
};

// User service
export const userService = {
  login: (username: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.username === username && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    
    return null;
  },
  
  register: (user: Omit<User, 'id'>): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const newUser = { ...user, id: users.length > 0 ? Math.max(...users.map((u: User) => u.id)) + 1 : 1 };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    
    const { password, ...userWithoutPassword } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },
  
  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
  
  getCurrentUser: (): Omit<User, 'password'> | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }
};

// Cart service
export const cartService = {
  getCartItems: (userId: string): CartItem[] => {
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || '[]');
    return cartItems.filter((item: CartItem) => item.userId === userId);
  },
  
  addToCart: (cartItem: Omit<CartItem, 'id' | 'addedAt'>): CartItem => {
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || '[]');
    const existingItemIndex = cartItems.findIndex(
      (item: CartItem) => item.userId === cartItem.userId && item.bookId === cartItem.bookId
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      cartItems[existingItemIndex].quantity += cartItem.quantity;
      localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
      return cartItems[existingItemIndex];
    } else {
      // Add new item
      const newCartItem = { 
        ...cartItem, 
        id: cartItems.length > 0 ? Math.max(...cartItems.map((i: CartItem) => i.id)) + 1 : 1,
        addedAt: new Date().toISOString()
      };
      localStorage.setItem(CART_ITEMS_KEY, JSON.stringify([...cartItems, newCartItem]));
      return newCartItem;
    }
  },
  
  updateCartItem: (cartItem: CartItem): CartItem => {
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || '[]');
    const updatedCartItems = cartItems.map((item: CartItem) => 
      item.id === cartItem.id ? cartItem : item
    );
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(updatedCartItems));
    return cartItem;
  },
  
  removeFromCart: (cartItemId: number): void => {
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || '[]');
    const filteredCartItems = cartItems.filter((item: CartItem) => item.id !== cartItemId);
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(filteredCartItems));
  },
  
  clearCart: (userId: string): void => {
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || '[]');
    const remainingItems = cartItems.filter((item: CartItem) => item.userId !== userId);
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(remainingItems));
  }
};

// Order service
export const orderService = {
  createOrder: (userId: string, total: number): Order => {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map((o: Order) => o.id)) + 1 : 1,
      userId,
      status: 'pending',
      total,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(ORDERS_KEY, JSON.stringify([...orders, newOrder]));
    return newOrder;
  },
  
  createOrderItems: (orderItems: Omit<OrderItem, 'id'>[]): OrderItem[] => {
    const allOrderItems = JSON.parse(localStorage.getItem(ORDER_ITEMS_KEY) || '[]');
    const newOrderItems = orderItems.map((item, index) => ({
      ...item,
      id: allOrderItems.length > 0 ? Math.max(...allOrderItems.map((i: OrderItem) => i.id)) + index + 1 : index + 1
    }));
    
    localStorage.setItem(ORDER_ITEMS_KEY, JSON.stringify([...allOrderItems, ...newOrderItems]));
    return newOrderItems;
  },
  
  getOrdersByUser: (userId: string): Order[] => {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return orders.filter((order: Order) => order.userId === userId);
  },
  
  getOrderItemsByOrderId: (orderId: number): OrderItem[] => {
    const orderItems = JSON.parse(localStorage.getItem(ORDER_ITEMS_KEY) || '[]');
    return orderItems.filter((item: OrderItem) => item.orderId === orderId);
  }
};
