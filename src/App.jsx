import React, { useState, useMemo, useCallback, useReducer, useEffect } from 'react';
import useFetchPhotos from './hooks/useFetchPhotos';

// 1. Reducer Function (Our Strict Manager)
// This is created outside the component because it is independent of the rest of the component's elements.

const favouritesReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE':

      // If the photo ID is already in the status (favorites list), filter it out.

      if (state.includes(action.payload)) {
        return state.filter(id => id !== action.payload);
      } 

      // If it doesn't exist, add the new ID to the old list.

      else {
        return [...state, action.payload];
      }
    default:
      return state;
  }
};

// 2. Initial State (Reading from the Diary)
// As soon as the page loads, it checks whether anything is already saved in Local Storage.

const initFavourites = () => {
  const savedFavourites = localStorage.getItem('favourites');
// If something is found, convert it into an array (JSON.parse); otherwise, return an empty array [].
  return savedFavourites ? JSON.parse(savedFavourites) : [];
};

function App() {
  const { photos, loading, error } = useFetchPhotos();
  const [searchQuery, setSearchQuery] = useState('');

// 3. useReducer Setup
// favourites: Hamari current list
// dispatch: Wo parchi bhejane wala function
  const [favourites, dispatch] = useReducer(favouritesReducer, [], initFavourites);

// 4. Effect (Writing to the Diary)
// Whenever the 'favorites' state changes, this will save it to Local Storage.
  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    if (!searchQuery) return photos;
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [photos, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-red-500 text-2xl font-bold bg-red-100 p-4 rounded-lg shadow-md">
          ⚠️ Oops! Error aagayi: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          Photo Gallery
        </h1>
        
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search by author name..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full max-w-md px-5 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 shadow-sm transition-colors text-gray-700 text-lg"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPhotos.map((photo) => {
            // Checking if the current photo ID is in our favorites list?
            const isFavourite = favourites.includes(photo.id);

            return (
              <div 
                key={photo.id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
              >
                <img 
                  src={photo.download_url} 
                  alt={photo.author} 
                  className="w-full h-56 object-cover" 
                />
                
                <div className="p-5 flex justify-between items-center">
                  <span className="font-semibold text-gray-700 truncate pr-4 text-lg">
                    {photo.author}
                  </span>
                  
                  {/* Heart button update */}
{/* On click, we send a Dispatch (slip) with the action type and Id (payload) */}
                  <button 
                    onClick={() => dispatch({ type: 'TOGGLE_FAVOURITE', payload: photo.id })}
                    className="text-3xl focus:outline-none transition-transform active:scale-75"
                    title={isFavourite ? "Remove from favourites" : "Mark as favourite"}
                  >
                    {/* If it's a favorite, a red heart (❤️); otherwise, a white heart (🤍) */}
                    {isFavourite ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredPhotos.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-xl py-10">
              No photos found under this author's name.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;