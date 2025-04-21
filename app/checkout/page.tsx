'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, CreditCard, Truck, User, AlertCircle } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  
  // Form states
  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && currentStep !== 'confirmation') {
      router.push('/');
    }
  }, [items, router, currentStep]);
  
  const handleNextStep = () => {
    setError('');
    
    if (currentStep === 'information') {
      if (!email || !firstName || !lastName || !address || !city || !state || !zipCode) {
        setError('Please fill in all required fields');
        return;
      }
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Process order
      const orderNum = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(orderNum);
      setCurrentStep('confirmation');
      clearCart();
    }
  };
  
  const total = getTotal();
  const shipping = 5.99;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Steps progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex flex-col items-center ${currentStep === 'information' ? 'text-primary' : 'text-gray-500'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'information' 
                ? 'bg-primary text-white' 
                : currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'confirmation'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
            }`}>
              {currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'confirmation' ? <Check size={16} /> : 1}
            </div>
            <span className="mt-1 text-sm">Information</span>
          </div>
          
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${
              currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
          </div>
          
          <div className={`flex flex-col items-center ${currentStep === 'shipping' ? 'text-primary' : 'text-gray-500'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'shipping' 
                ? 'bg-primary text-white' 
                : currentStep === 'payment' || currentStep === 'confirmation'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
            }`}>
              {currentStep === 'payment' || currentStep === 'confirmation' ? <Check size={16} /> : 2}
            </div>
            <span className="mt-1 text-sm">Shipping</span>
          </div>
          
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${
              currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
          </div>
          
          <div className={`flex flex-col items-center ${currentStep === 'payment' ? 'text-primary' : 'text-gray-500'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'payment' 
                ? 'bg-primary text-white' 
                : currentStep === 'confirmation'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
            }`}>
              {currentStep === 'confirmation' ? <Check size={16} /> : 3}
            </div>
            <span className="mt-1 text-sm">Payment</span>
          </div>
          
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${
              currentStep === 'confirmation' ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
          </div>
          
          <div className={`flex flex-col items-center ${currentStep === 'confirmation' ? 'text-primary' : 'text-gray-500'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'confirmation' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}>
              {currentStep === 'confirmation' ? <Check size={16} /> : 4}
            </div>
            <span className="mt-1 text-sm">Confirmation</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="text-red-400" size={20} />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout form */}
        <div className="lg:col-span-2">
          {currentStep === 'information' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2" size={20} />
                Contact Information
              </h2>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <h2 className="text-xl font-semibold mb-4 mt-8">Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 'shipping' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Truck className="mr-2" size={20} />
                Shipping Method
              </h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4 flex items-start">
                  <input
                    type="radio"
                    id="standard"
                    name="shipping"
                    defaultChecked
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor="standard" className="ml-3 flex-1">
                    <span className="block font-medium text-gray-900">Standard Shipping</span>
                    <span className="block text-sm text-gray-500">Delivery in 3-5 business days</span>
                  </label>
                  <span className="text-gray-900 font-medium">$5.99</span>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4 flex items-start">
                  <input
                    type="radio"
                    id="express"
                    name="shipping"
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor="express" className="ml-3 flex-1">
                    <span className="block font-medium text-gray-900">Express Shipping</span>
                    <span className="block text-sm text-gray-500">Delivery in 1-2 business days</span>
                  </label>
                  <span className="text-gray-900 font-medium">$12.99</span>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 'payment' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="mr-2" size={20} />
                Payment Method
              </h2>
              
              <div className="mb-6">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4 bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> This is a demo store. No real payments will be processed.
                </p>
              </div>
            </div>
          )}
          
          {currentStep === 'confirmation' && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully. We've sent a confirmation email with order details.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-gray-600">Order Number: <span className="font-semibold">{orderNumber}</span></p>
              </div>
              
              <Link 
                href="/books" 
                className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          )}
          
          {currentStep !== 'confirmation' && (
            <div className="mt-8 flex justify-between">
              {currentStep !== 'information' ? (
                <button
                  onClick={() => {
                    if (currentStep === 'shipping') setCurrentStep('information');
                    if (currentStep === 'payment') setCurrentStep('shipping');
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              ) : (
                <Link 
                  href="/books"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Continue Shopping
                </Link>
              )}
              
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                {currentStep === 'payment' ? 'Place Order' : 'Continue'}
              </button>
            </div>
          )}
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {currentStep !== 'confirmation' && (
              <div className="mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.book.imageUrl || 'https://via.placeholder.com/80x100?text=No+Image'}
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <p className="font-medium line-clamp-1">{item.book.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="ml-2 font-medium">
                      ${(parseFloat(item.book.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}