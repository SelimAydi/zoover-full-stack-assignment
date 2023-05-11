import React, { useState } from "react";

const FilterSort = ({ onFilterSortChange }) => {
  const [filterBy, setSelectedFilter] = useState("all");
  const [sortBy, setSelectedSort] = useState("entryDate");

  const handleFilterChange = (event) => {
    const selectedFilterValue = event.target.value;
    setSelectedFilter(selectedFilterValue);

    onFilterSortChange({ filterBy: selectedFilterValue, sortBy });
  };

  const handleSortChange = (event) => {
    const selectedSortValue = event.target.value;
    setSelectedSort(selectedSortValue);

    onFilterSortChange({ filterBy, sortBy: selectedSortValue });
  };

  return (
    <div className="filter-bar-sort">
      <div className="filter">
        <label htmlFor="filter">Filter by:</label>
        <select
          id="filterSelect"
          value={filterBy}
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="FAMILY">FAMILY</option>
          <option value="FRIENDS">FRIENDS</option>
          <option value="OTHER">OTHER</option>
          <option value="COUPLE">COUPLE</option>
          <option value="SINGLE">SINGLE</option>
        </select>
      </div>
      <div className="sort">
        <label htmlFor="sort">Sort by:</label>
        <div class="sort">
          <label>
            <input
              type="radio"
              name="travelDate"
              value="travelDate"
              checked={sortBy === "travelDate"}
              onChange={handleSortChange}
            />
            Travel date
          </label>
          <label>
            <input
              type="radio"
              name="entryDate"
              value="entryDate"
              checked={sortBy === "entryDate"}
              onChange={handleSortChange}
              defaultChecked
            />
            Entry date
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterSort;
