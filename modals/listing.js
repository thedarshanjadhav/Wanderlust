const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: 'https://www.istockphoto.com/photo/happy-family-on-sunbeds-enjoys-their-vacation-on-a-tropical-beach-gm1295012710-388848500i',
        set: (v) => v === '' ? 'https://www.istockphoto.com/photo/happy-family-on-sunbeds-enjoys-their-vacation-on-a-tropical-beach-gm1295012710-388848500i' : v
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;