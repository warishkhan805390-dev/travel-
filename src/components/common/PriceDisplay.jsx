export default function PriceDisplay({ price, originalPrice, currency = 'USD', size = 'md', showDiscount = true }) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const sizeClasses = {
    sm: { price: 'text-lg', original: 'text-sm', badge: 'text-xs' },
    md: { price: 'text-2xl', original: 'text-base', badge: 'text-sm' },
    lg: { price: 'text-3xl', original: 'text-lg', badge: 'text-base' },
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`font-bold text-gray-900 dark:text-white ${sizeClasses[size].price}`}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <div className="flex items-center gap-2">
          <span className={`text-gray-400 dark:text-gray-500 line-through ${sizeClasses[size].original}`}>
            {formatPrice(originalPrice)}
          </span>
          {showDiscount && discount > 0 && (
            <span className={`px-2 py-0.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold ${sizeClasses[size].badge}`}>
              {discount}% OFF
            </span>
          )}
        </div>
      )}
    </div>
  )
}
