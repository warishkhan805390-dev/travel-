export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const truncateText = (text, length = 100) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

export const calculateDiscount = (price, discountPrice) => {
  if (!discountPrice) return 0
  return Math.round(((price - discountPrice) / price) * 100)
}

export const getImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
  if (image.startsWith('http')) return image
  return image
}

export const destinations = [
  { name: 'India', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800' },
  { name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800' },
  { name: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800' },
  { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800' },
  { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800' },
  { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
  { name: 'Turkey', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800' },
  { name: 'Europe', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800' },
  { name: 'Switzerland', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800' },
  { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
  { name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
  { name: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800' },
  { name: 'Nepal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800' },
  { name: 'Kashmir', image: 'https://images.unsplash.com/photo-1597432538812-8e8217f0f92c?w=800' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800' },
  { name: 'Himachal', image: 'https://images.unsplash.com/photo-1589462130649-165ff6174278?w=800' },
  { name: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216059760-1b9e3bb512e1?w=800' },
]
