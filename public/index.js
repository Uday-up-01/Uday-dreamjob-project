const express = require('express');
const app = express();
const port = 8080;
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('DreamJob_1.ejs');
});

app.get('/ContactUs', (req, res) => {
    res.render('Contact_Us.ejs');
});

app.get('/ContactUs', (req, res) => {
    res.render('Signup.ejs');
});

app.get('/Login', (req, res) => {
    res.render('Login.ejs', { posts });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});