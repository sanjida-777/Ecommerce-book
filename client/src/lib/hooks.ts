import { useState, useEffect } from 'react';
import { Book, CartItem } from '@shared/schema';
import { bookService, cartService, userService } from './services';

// Book hooks
export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = bookService.getAll();
        setBooks(allBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { books, loading };
};

export const useBooksByCategory = (category: string) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const filteredBooks = bookService.getByCategory(category);
        setBooks(filteredBooks);
      } catch (error) {
        console.error('Error fetching books by category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  return { books, loading };
};

export const useBook = (id: number) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const foundBook = bookService.getById(id);
        setBook(foundBook || null);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading };
};

export const useFeaturedBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const featuredBooks = bookService.getFeatured();
        setBooks(featuredBooks);
      } catch (error) {
        console.error('Error fetching featured books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { books, loading };
};

export const useNewReleases = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const newReleases = bookService.getNewReleases();
        setBooks(newReleases);
      } catch (error) {
        console.error('Error fetching new releases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { books, loading };
};

export const useSearchBooks = (query: string) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const searchResults = bookService.searchBooks(query);
        setBooks(searchResults);
      } catch (error) {
        console.error('Error searching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  return { books, loading };
};

// Cart hooks
export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = userService.getCurrentUser();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const items = cartService.getCartItems(user.id.toString());
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  // Calculate cart total and items with details
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<Array<CartItem & { book: Book }>>([]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setCartTotal(0);
      setCartItemsWithDetails([]);
      return;
    }

    const allBooks = bookService.getAll();
    const itemsWithDetails = cartItems.map(item => {
      const book = allBooks.find(b => b.id === item.bookId);
      if (!book) throw new Error(`Book with ID ${item.bookId} not found`);
      return { ...item, book };
    });

    const total = itemsWithDetails.reduce((sum, item) => 
      sum + (Number(item.book.price) * item.quantity), 0);

    setCartItemsWithDetails(itemsWithDetails);
    setCartTotal(total);
  }, [cartItems]);

  return { cartItems, cartTotal, cartItemsWithDetails, loading };
};
