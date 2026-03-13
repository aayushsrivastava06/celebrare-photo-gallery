import { useState, useEffect } from 'react';

const useFetchPhotos = () => {
  // Requirement ke hisaab se 3 states banayenge: photos, loading, aur error 
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ye function hamara Helper hai jo API bazaar se data layega
    const fetchPhotos = async () => {
      try {
        // Picsum API call kar rahe hain 30 photos ke liye [cite: 18, 19]
        const response = await fetch('https://picsum.photos/v2/list?page=1&limit=30');
        
        if (!response.ok) {
          throw new Error('Network response mein gadbad hai');
        }
        
        const data = await response.json();
        setPhotos(data); // Data aagaya toh 'photos' state mein save kar lo
      } catch (err) {
        setError(err.message); // Agar koi error aayi toh 'error' state mein daal do
      } finally {
        // Chahe data aaye ya error, data aane ka wait (loading) khatam ho gaya
        setLoading(false); 
      }
    };

    fetchPhotos();
  }, []); // Empty array '[]' ka matlab hai: Ye helper sirf ek baar market jayega jab app start hoga.

  // Assignment ke hisaab se exactly ye 3 cheezein return karni hain 
  return { photos, loading, error };
};

export default useFetchPhotos;