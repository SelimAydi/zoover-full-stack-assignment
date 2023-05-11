import React from "react";

const Star = ({ filled, halfFilled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    version="1.1"
    viewBox="0 0 47.94 47.94"
    xmlSpace="preserve"
  >
    <defs>
      <linearGradient id="half-fill" x1="0" x2="100%" y1="0" y2="0">
        <stop offset="50%" stopColor="#ffb259" />
        <stop offset="50%" stopColor="#f4f4f4" />
      </linearGradient>
    </defs>
    <path
      fill={halfFilled ? "url(#half-fill)" : filled ? "#ffb259" : "#f4f4f4"}
      d="M26.285 2.486l5.407 10.956a2.58 2.58 0 001.944 1.412l12.091 1.757c2.118.308 2.963 2.91 1.431 4.403l-8.749 8.528a2.582 2.582 0 00-.742 2.285l2.065 12.042c.362 2.109-1.852 3.717-3.746 2.722l-10.814-5.685a2.585 2.585 0 00-2.403 0l-10.814 5.685c-1.894.996-4.108-.613-3.746-2.722l2.065-12.042a2.582 2.582 0 00-.742-2.285L.783 21.014c-1.532-1.494-.687-4.096 1.431-4.403l12.091-1.757a2.58 2.58 0 001.944-1.412l5.407-10.956c.946-1.919 3.682-1.919 4.629 0z"
    ></path>
  </svg>
);

const StarRating = ({ score }) => {
  const maxScore = 10;
  const filledStars = Math.floor(score);
  const halfStar = score % 1 >= 0.5;

  const stars = [];
  for (let i = 1; i <= maxScore; i++) {
    if (i <= filledStars) {
      stars.push(<Star key={i} filled />);
    } else if (i === filledStars + 1 && halfStar) {
      stars.push(<Star key={i} filled halfFilled />);
    } else {
      stars.push(<Star key={i} filled={false} />);
    }
  }

  return <div>{stars}</div>;
};

export default StarRating;
