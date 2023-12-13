const express = require('express')
const app = express();
const mongoose = require('mongoose');
const Listing = require('./modals/listing.js')
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

main()
    .then((res) => {
        console.log('connected to DB' + res);
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
    res.send('Welcome, I am root!');
})

// Index Route
app.get('/listings', async (req, res) => {
    try {
        const allListings = await Listing.find({})

        console.log(allListings);
        res.render('listings/index.ejs', { allListings });
    } catch {
        console.log('');
    }
})

// New Route
app.get('/listings/new', async (req, res) => {
    res.render('listings/new.ejs');
})

// Create Route
app.post('/listings', async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
    // console.log(listing);
})

// Show Route
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
})



// Edit Route 
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
})

// Update Route
app.put('/listings/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})

// Delete Route
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect('/listings');
})

// app.get('/testListing', async (req, res) => {
//     let sampleListing = new Listing({
//         title: 'My New Villa',
//         description: 'By the beach',
//         price: 1200,
//         location: 'Goal',
//         country: 'india'
//     });

//     await sampleListing.save();
//     console.log('sampleListing saved');
//     res.send('sampleListing testing');
// });

app.listen(8080, () => {
    console.log('listening on port 8080');
})