const StarRating = ({ rating, size = 'normal' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<span key={i} style={{ color: '#ffc107' }}>★</span>);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<span key={i} style={{ color: '#ffc107' }}>★</span>); // Simplified for half star
    } else {
      stars.push(<span key={i} style={{ color: '#e0e0e0' }}>★</span>);
    }
  }

  const fontSize = size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem';

  return (
    <div style={{ fontSize, display: 'inline-flex' }}>
      {stars}
    </div>
  );
};

export default StarRating;
