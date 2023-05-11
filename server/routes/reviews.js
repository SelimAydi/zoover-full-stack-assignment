var express = require("express");
var _ = require("underscore");
var router = express.Router();
var axios = require("axios");

var util = require("../_util");

router.get("/:accommodationId", async function (req, res) {
  try {
    const {
      data: { data: reviews },
    } = await axios.get(
      `http://localhost:8888/accommodations/${req.params.accommodationId}/reviews`
    );

    let { start = 1, limit, filterBy, sortBy = "entryDate" } = req.query;
    let data = _.sortBy(reviews, sortBy).reverse(); // reverse to sort desc
    let filtered = data.filter((review) =>
      filterBy ? review.traveledWith === filterBy : true
    );
    let paginated = filtered.slice(start - 1, limit);
    res.json({ all: data, filtered: filtered, limited: paginated });
  } catch (error) {
    // Handle error
    res.status(404).json({ statusCode: 404 });
  }
});

router.get("/average/:accommodationId", async function (req, res) {
  try {
    const {
      data: { data: reviews },
    } = await axios.get(
      `http://localhost:8888/accommodations/${req.params.accommodationId}/reviews`
    );

    let { generalAvg, aspecsAvg } = util.getAverageRatings(reviews);
    let traveledWithAvg = util.getAverageTravelledWith(reviews);
    res.json({ generalAvg, aspecsAvg, traveledWithAvg });
  } catch (error) {
    // Handle error
    res.status(404).json({ statusCode: 404 });
  }
});

module.exports = router;
