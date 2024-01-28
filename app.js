if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express')
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const Mongostore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const dbUrl = process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log('connected to DB' + res);
    })
    .catch((err) => {
        console.log(err);
    })


// Localhost mongodb
// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

// Atlas mongodb
async function main() {
    await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')))


const store = Mongostore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
        touchAfter: 24 * 3600,
    }
})

store.on('error', () => {
    console.log('Error in Mongo Session Store', err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        express: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

// app.get('/', (req, res) => {
//     res.send('Welcome, I am root!');
// })



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    console.log(res.locals.currUser);
    next();
})

// app.get('/demouser', async (req, res) => {
//     let fakeUser = new User({
//         email: 'student@gmail.com',
//         username: 'delta-student'
//     });

//     let registerUser = await User.register(fakeUser, 'helloworld');
//     res.send(registerUser);
// })

// Router
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error.ejs', { message });
})

app.listen(8080, () => {
    console.log('listening on port 8080');
})