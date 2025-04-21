import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to the actual app
    window.location.href = '/client/';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Book Store</h1>
        <p>Loading the application...</p>
      </div>
    </div>
  );
}