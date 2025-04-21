import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Book } from '@shared/schema';
import { bookService } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash, Plus, BookOpenCheck, ArrowLeft } from 'lucide-react';
import { categories } from '@/lib/demoData';

export default function Admin() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Partial<Book>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load books
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
      setLocation('/');
      toast({
        title: "Access Denied",
        description: "You need to be an admin to access this page.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    const allBooks = bookService.getAll();
    setBooks(allBooks);
    setLoading(false);
  }, [isAuthenticated, isAdmin, setLocation, toast]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentBook({ ...currentBook, [name]: value });
    
    // Clear error
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCurrentBook({ ...currentBook, [name]: checked });
  };
  
  // Handle number input change
  const handleNumberChange = (name: string, value: string) => {
    const parsedValue = value === '' ? 0 : parseFloat(value);
    setCurrentBook({ ...currentBook, [name]: parsedValue });
    
    // Clear error
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCurrentBook({ ...currentBook, category: value });
    
    // Clear error
    if (errors.category) {
      setErrors({ ...errors, category: '' });
    }
  };
  
  // Open add/edit dialog
  const openDialog = (book?: Book) => {
    if (book) {
      setCurrentBook({ ...book });
      setIsEditing(true);
    } else {
      setCurrentBook({
        title: '',
        author: '',
        description: '',
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: '',
        stock: 0,
        featured: false,
        newRelease: false,
        rating: 0,
        reviewCount: 0,
      });
      setIsEditing(false);
    }
    setErrors({});
    setIsDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (book: Book) => {
    setCurrentBook(book);
    setIsDeleteDialogOpen(true);
  };
  
  // Close dialogs
  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentBook.title?.trim()) newErrors.title = 'Title is required';
    if (!currentBook.author?.trim()) newErrors.author = 'Author is required';
    if (!currentBook.description?.trim()) newErrors.description = 'Description is required';
    if (!currentBook.category?.trim()) newErrors.category = 'Category is required';
    
    if (currentBook.price === undefined || currentBook.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!currentBook.imageUrl?.trim()) newErrors.imageUrl = 'Image URL is required';
    
    if (currentBook.stock === undefined || currentBook.stock < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Save book
  const saveBook = () => {
    if (!validateForm()) return;
    
    try {
      if (isEditing && currentBook.id) {
        const updatedBook = bookService.updateBook(currentBook as Book);
        
        // Update books list
        setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)));
        
        toast({
          title: "Book Updated",
          description: `"${updatedBook.title}" has been updated.`,
        });
      } else {
        const newBook = bookService.addBook(currentBook as Omit<Book, 'id'>);
        
        // Add to books list
        setBooks([...books, newBook]);
        
        toast({
          title: "Book Added",
          description: `"${newBook.title}" has been added to the inventory.`,
        });
      }
      
      closeDialog();
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        title: "Error",
        description: "Failed to save book. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Delete book
  const deleteBook = () => {
    try {
      if (currentBook.id) {
        bookService.deleteBook(currentBook.id);
        
        // Update books list
        setBooks(books.filter((book) => book.id !== currentBook.id));
        
        toast({
          title: "Book Deleted",
          description: `"${currentBook.title}" has been removed from the inventory.`,
        });
      }
      
      closeDialog();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Redirect happens in useEffect
  }
  
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <Button
          variant="link"
          className="p-0 text-primary"
          onClick={() => setLocation('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
        <h1 className="text-3xl font-heading font-bold mt-4 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your book inventory</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-heading font-semibold">Book Inventory</h2>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add New Book
          </Button>
        </div>
        
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p>Loading inventory...</p>
          </div>
        ) : books.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>New Release</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>${Number(book.price).toFixed(2)}</TableCell>
                    <TableCell className={book.stock === 0 ? 'text-red-500 font-bold' : ''}>
                      {book.stock}
                    </TableCell>
                    <TableCell>{book.featured ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{book.newRelease ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDialog(book)}
                        className="text-gray-500 hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(book)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <BookOpenCheck className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-heading font-bold mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">Your inventory is empty. Add some books to get started.</p>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add New Book
            </Button>
          </div>
        )}
      </div>
      
      {/* Add/Edit Book Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? `Edit Book: ${currentBook.title}` : 'Add New Book'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentBook.title || ''}
                  onChange={handleChange}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="author">Author*</Label>
                <Input
                  id="author"
                  name="author"
                  value={currentBook.author || ''}
                  onChange={handleChange}
                  className={errors.author ? 'border-red-500' : ''}
                />
                {errors.author && (
                  <p className="text-red-500 text-sm mt-1">{errors.author}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentBook.description || ''}
                  onChange={handleChange}
                  className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="price">Price ($)*</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentBook.price || ''}
                  onChange={(e) => handleNumberChange('price', e.target.value)}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="stock">Stock*</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={currentBook.stock || ''}
                  onChange={(e) => handleNumberChange('stock', e.target.value)}
                  className={errors.stock ? 'border-red-500' : ''}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="category">Category*</Label>
                <Select
                  value={currentBook.category || ''}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category" className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Image URL*</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={currentBook.imageUrl || ''}
                  onChange={handleChange}
                  className={errors.imageUrl ? 'border-red-500' : ''}
                />
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={currentBook.featured || false}
                  onCheckedChange={(checked) => handleCheckboxChange('featured', checked === true)}
                />
                <Label htmlFor="featured">Featured Book</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newRelease"
                  checked={currentBook.newRelease || false}
                  onCheckedChange={(checked) => handleCheckboxChange('newRelease', checked === true)}
                />
                <Label htmlFor="newRelease">New Release</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={saveBook}>
              {isEditing ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete "{currentBook.title}"?</p>
            <p className="text-gray-500 text-sm mt-1">This action cannot be undone.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteBook}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
