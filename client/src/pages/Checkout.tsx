import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, ArrowLeft, CreditCard, Truck, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmation';

export default function Checkout() {
  const { cartItems, cartTotal, checkout, isCheckingOut } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [orderId, setOrderId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    shippingMethod: 'standard',
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate order summary
  const subtotal = cartTotal;
  const shipping = formData.shippingMethod === 'express' ? 12.99 : 5.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;
  
  // Check if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== 'confirmation') {
      setLocation('/');
      toast({
        title: "Your cart is empty",
        description: "Add some books to your cart before checking out.",
      });
    }
  }, [cartItems, currentStep, setLocation, toast]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Handle radio selection
  const handleRadioChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  // Validate each step
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 'information') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    } else if (currentStep === 'payment') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Date format should be MM/YY';
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (!validateStep()) return;
    
    if (currentStep === 'information') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('information');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    // Process the payment (simulated)
    const orderNumber = await checkout();
    
    if (orderNumber) {
      setOrderId(orderNumber);
      setCurrentStep('confirmation');
      window.scrollTo(0, 0);
    } else {
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle continue shopping
  const handleContinueShopping = () => {
    setLocation('/');
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: formattedValue });
    
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: '' });
    }
  };
  
  return (
    <div className="container mx-auto px-6 py-12">
      {currentStep !== 'confirmation' ? (
        <div className="mb-8">
          <Button
            variant="link"
            className="p-0 text-primary"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shopping
          </Button>
          <h1 className="text-3xl font-heading font-bold mt-4 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>
      ) : (
        <div className="text-center my-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">Thank you for your purchase.</p>
        </div>
      )}
      
      <div className="lg:flex lg:gap-12">
        {/* Checkout Form */}
        <div className="lg:w-2/3 mb-8 lg:mb-0">
          {currentStep !== 'confirmation' ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <Tabs value={currentStep} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger 
                      value="information"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Information
                    </TabsTrigger>
                    <TabsTrigger 
                      value="shipping"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Shipping
                    </TabsTrigger>
                    <TabsTrigger 
                      value="payment"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Payment
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="information" className="pt-6">
                    <h2 className="text-xl font-heading font-semibold mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-heading font-semibold mb-4">Shipping Address</h2>
                    <div className="mb-6">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={errors.state ? "border-red-500" : ""}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className={errors.zipCode ? "border-red-500" : ""}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button onClick={handleNextStep}>Continue to Shipping</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="shipping" className="pt-6">
                    <h2 className="text-xl font-heading font-semibold mb-4">Shipping Method</h2>
                    
                    <RadioGroup value={formData.shippingMethod} className="mb-6">
                      <div 
                        className={`flex items-start p-4 rounded-lg border mb-4 cursor-pointer ${formData.shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                        onClick={() => handleRadioChange('shippingMethod', 'standard')}
                      >
                        <RadioGroupItem value="standard" id="standard" className="mt-1" />
                        <div className="ml-3 flex-1">
                          <Label htmlFor="standard" className="font-semibold text-lg cursor-pointer">Standard Shipping</Label>
                          <p className="text-gray-600">Delivery in 3-5 business days</p>
                          <p className="text-primary font-semibold mt-1">$5.99</p>
                        </div>
                        <div className="ml-4">
                          <Truck className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      
                      <div 
                        className={`flex items-start p-4 rounded-lg border cursor-pointer ${formData.shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                        onClick={() => handleRadioChange('shippingMethod', 'express')}
                      >
                        <RadioGroupItem value="express" id="express" className="mt-1" />
                        <div className="ml-3 flex-1">
                          <Label htmlFor="express" className="font-semibold text-lg cursor-pointer">Express Shipping</Label>
                          <p className="text-gray-600">Delivery in 1-2 business days</p>
                          <p className="text-primary font-semibold mt-1">$12.99</p>
                        </div>
                        <div className="ml-4">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                    </RadioGroup>
                    
                    <div className="mt-8 flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Back
                      </Button>
                      <Button onClick={handleNextStep}>Continue to Payment</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payment" className="pt-6">
                    <h2 className="text-xl font-heading font-semibold mb-4">Payment Method</h2>
                    
                    <RadioGroup value={formData.paymentMethod} className="mb-6">
                      <div 
                        className={`flex items-start p-4 rounded-lg border mb-4 cursor-pointer ${formData.paymentMethod === 'credit' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                        onClick={() => handleRadioChange('paymentMethod', 'credit')}
                      >
                        <RadioGroupItem value="credit" id="credit" className="mt-1" />
                        <div className="ml-3 flex-1">
                          <Label htmlFor="credit" className="font-semibold text-lg cursor-pointer">Credit Card</Label>
                          <p className="text-gray-600">Pay with Visa, Mastercard, or American Express</p>
                        </div>
                        <div className="ml-4">
                          <CreditCard className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                    </RadioGroup>
                    
                    <div className="mb-6">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className={errors.cardNumber ? "border-red-500" : ""}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <Label htmlFor="cardName">Name on Card *</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className={errors.cardName ? "border-red-500" : ""}
                      />
                      {errors.cardName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date (MM/YY) *</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={errors.expiryDate ? "border-red-500" : ""}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          maxLength={4}
                          className={errors.cvv ? "border-red-500" : ""}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        disabled={isCheckingOut}
                      >
                        {isCheckingOut ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          `Complete Order • $${total.toFixed(2)}`
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-heading font-semibold mb-4">Order Details</h2>
                <p className="text-gray-600 mb-2">
                  Order #{orderId}
                </p>
                <p className="text-gray-600">
                  A confirmation email has been sent to {formData.email}
                </p>
              </div>
              
              <div className="border-t border-b py-6 mb-6">
                <h3 className="font-semibold mb-4">Shipping Information</h3>
                <p className="mb-1">{formData.firstName} {formData.lastName}</p>
                <p className="mb-1">{formData.address}</p>
                <p className="mb-1">{formData.city}, {formData.state} {formData.zipCode}</p>
                <p>{formData.country}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Shipping Method</h3>
                <p>
                  {formData.shippingMethod === 'express' 
                    ? 'Express Shipping (1-2 business days)' 
                    : 'Standard Shipping (3-5 business days)'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Estimated delivery: {
                    formData.shippingMethod === 'express'
                      ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
                      : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  }
                </p>
              </div>
              
              <div className="text-center mt-8">
                <Button onClick={handleContinueShopping}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Order Summary</h2>
            
            {currentStep !== 'confirmation' && (
              <div className="max-h-80 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex mb-4 pb-4 border-b">
                    <div className="w-16 h-20 flex-shrink-0 mr-4">
                      <img
                        src={item.book.imageUrl}
                        alt={item.book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-sm">{item.book.title}</h3>
                      <p className="text-gray-500 text-xs mb-1">{item.book.author}</p>
                      <div className="flex justify-between">
                        <span className="text-xs">Qty: {item.quantity}</span>
                        <span className="text-sm font-semibold">
                          ${(Number(item.book.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            {currentStep === 'confirmation' && (
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <p className="text-green-700 text-center">
                  Thank you for your order!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
