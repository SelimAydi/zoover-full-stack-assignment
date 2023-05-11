import React, { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "./Star";
import Bar from "./Bar";
import FilterSort from "./FilterSort";
import { useParams } from "react-router-dom";

const App = () => {
  const { id } = useParams();
  const accommodationId = id ?? "1";

  const [accommodation, setAccommodation] = useState({});
  const [accommodationMetadata, setAccommodationMetadata] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: accommodationData } = await axios.get(
        `http://localhost:8888/accommodations/${accommodationId}`
      );
      const { data: metadata } = await axios.get(
        `http://localhost:8080/reviews/average/${accommodationId}`
      );
      const { data: reviewsData } = await axios.get(
        `http://localhost:8080/reviews/${accommodationId}`
      );

      setAccommodation(accommodationData);
      setAccommodationMetadata(metadata);
      setReviews(reviewsData);
    } catch (error) {
      // Handle error
    }
  };

  const handleFilterSortChange = async ({ filterBy, sortBy }) => {
    try {
      const { data: reviewsData } = await axios.get(
        `http://localhost:8080/reviews/${accommodationId}`,
        {
          params: {
            ...(filterBy !== "all" && { filterBy }),
            ...(sortBy && { sortBy }),
          },
        }
      );

      setReviews(reviewsData);
    } catch (error) {
      // Handle error
    }
  };

  const getFormattedFloat = (value) => {
    const oneDecimalPlace = parseFloat(value).toFixed(1);

    return parseFloat(oneDecimalPlace);
  };

  return (
    <div className="container">
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="title-container">
            <h1>{accommodation.name}</h1>
            <div className="general-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                version="1.1"
                viewBox="0 0 47.94 47.94"
                xmlSpace="preserve"
              >
                <path
                  fill="#ffb259"
                  d="M26.285 2.486l5.407 10.956a2.58 2.58 0 001.944 1.412l12.091 1.757c2.118.308 2.963 2.91 1.431 4.403l-8.749 8.528a2.582 2.582 0 00-.742 2.285l2.065 12.042c.362 2.109-1.852 3.717-3.746 2.722l-10.814-5.685a2.585 2.585 0 00-2.403 0l-10.814 5.685c-1.894.996-4.108-.613-3.746-2.722l2.065-12.042a2.582 2.582 0 00-.742-2.285L.783 21.014c-1.532-1.494-.687-4.096 1.431-4.403l12.091-1.757a2.58 2.58 0 001.944-1.412l5.407-10.956c.946-1.919 3.682-1.919 4.629 0z"
                ></path>
                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize="14px"
                  fontWeight="bold"
                >
                  {accommodationMetadata.generalAvg}
                </text>
              </svg>
            </div>
          </div>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed
            fermentum est. Nunc condimentum congue risus. Nam scelerisque nisl
            sit amet purus molestie, nec euismod lorem euismod. Sed sed
            facilisis leo, sed tempus nulla. Fusce tempus tincidunt nisi.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Nullam tortor orci, rutrum sit amet magna
            posuere, faucibus mattis sem. Fusce eget aliquam lorem. Mauris
            facilisis lobortis odio in varius. Proin ac ipsum sed magna euismod
            eleifend ac ac augue. Suspendisse non ipsum dui. Nam tristique
            rhoncus ultrices. Maecenas vel erat rutrum, dapibus nisi nec,
            imperdiet turpis.
          </p>

          <div class="ratings-container">
            <div class="ratings">
              {accommodationMetadata.aspecsAvg &&
                Object.keys(accommodationMetadata.aspecsAvg).map((key) => (
                  <div class="ratings-item">
                    <p>
                      {key} ({parseFloat(accommodationMetadata.aspecsAvg[key])}
                      /10)
                    </p>
                    <StarRating
                      score={parseFloat(accommodationMetadata.aspecsAvg[key])}
                    />
                  </div>
                ))}
            </div>
            <div class="ratings">
              {accommodationMetadata.aspecsAvg &&
                Object.keys(accommodationMetadata.traveledWithAvg).map(
                  (key) => (
                    <div class="ratings-item">
                      <p>
                        {key} (
                        {getFormattedFloat(
                          accommodationMetadata.traveledWithAvg[key]
                        )}
                        /10)
                      </p>
                      <Bar
                        percentage={getFormattedFloat(
                          accommodationMetadata.traveledWithAvg[key]
                        )}
                      />
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="left-column">
          <FilterSort onFilterSortChange={handleFilterSortChange} />
        </div>
        <div className="right-column">
          {reviews.filtered?.length &&
            reviews.filtered.map((review) => (
              <div class="review-item">
                <h4>{review.title || "Geen titel"}</h4>
                <p class="review-subtitle">
                  Posted by {review.userName} on{" "}
                  {new Date(review.entryDate).toLocaleDateString()}
                </p>
                <p class="review-subtitle">
                  Traveled on {new Date(review.travelDate).toLocaleDateString()}
                </p>
                <p>{review.reviewText}</p>
                <div className="review-ratings-container">
                  {Object.keys(review.ratings.aspects).map((key) => {
                    return review.ratings.aspects[key] ? (
                      <div class="review-ratings-item">
                        <p>
                          {key} ({review.ratings.aspects[key]}/10)
                        </p>
                        <StarRating score={review.ratings.aspects[key]} />
                      </div>
                    ) : (
                      <></>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
