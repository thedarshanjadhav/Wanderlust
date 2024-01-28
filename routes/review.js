// import packages
const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');

// import middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
// import controllers
const reviewController = require('../controllers/reviews.js');



// Post Route
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;