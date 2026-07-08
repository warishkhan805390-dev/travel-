import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (item) => {
    setWishlist(prev => {
      if (prev.some(i => i._id === item._id)) {
        toast.error('Already in wishlist')
        return prev
      }
      toast.success('Added to wishlist')
      return [...prev, item]
    })
  }

  const removeFromWishlist = (id) => {
    setWishlist(prev => {
      toast.success('Removed from wishlist')
      return prev.filter(i => i._id !== id)
    })
  }

  const isInWishlist = (id) => wishlist.some(i => i._id === id)

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
