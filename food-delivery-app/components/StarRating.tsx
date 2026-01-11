import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
    showValue?: boolean;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
}

export default function StarRating({
    rating,
    maxRating = 5,
    size = 20,
    showValue = false,
    interactive = false,
    onRatingChange
}: StarRatingProps) {
    const handleClick = (value: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= Math.round(rating);

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(starValue)}
                        disabled={!interactive}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                    >
                        <Star
                            size={size}
                            className={`${isFilled
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                } ${interactive && 'hover:text-yellow-200'}`}
                        />
                    </button>
                );
            })}
            {showValue && (
                <span className="ml-2 text-sm text-gray-600">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
