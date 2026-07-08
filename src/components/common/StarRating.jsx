import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export default function StarRating({ rating = 0, size = 'md', showValue = false }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  }

  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const adjustedFull = rating - fullStars >= 0.75 ? fullStars + 1 : fullStars

  for (let i = 1; i <= 5; i++) {
    if (i <= adjustedFull) {
      stars.push(<FaStar key={i} className="text-gold-500" />)
    } else if (i === adjustedFull + 1 && hasHalf) {
      stars.push(<FaStarHalfAlt key={i} className="text-gold-500" />)
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300 dark:text-gray-600" />)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex items-center gap-0.5 ${sizeClasses[size]}`}>
        {stars}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
