const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodoverride = require('method-override');
const session = require('express-session');

app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

let Admins = [
    {id: uuidv4(), Username: 'Uday', Email: "uday@gmail.com", Password: '1234'},
    {id: uuidv4(), Username: 'Harsh', Email: "harsh@gmail.com", Password: '1234'},
];

let Users = [
    {id: uuidv4(), Username: 'Ganga', Email: "ganga@gmail.com", Password: '1234'},
    {id: uuidv4(), Username: 'Ram', Email: "ram@gmail.com", Password: '1234'}
];

app.get('/', (req, res) => {
    res.render('DreamJob_1'); 
});

app.get('/ContactUs', (req, res) => {
    res.render('Contact_Us'); 
});

app.get('/UserLogin', (req, res) => {
    res.render('User_Login', { post: {} });
});

app.get('/AdminLogin', (req, res) => {
    res.render('Admin_Login', { post: {} });
});

app.get('/state/:state', (req, res) => {
    let { state} = req.params;
    res.render(`${state}`);
});

app.get('/jobs/:category', (req, res) => {
    let {category} = req.params;
    res.render(`${category}`);
});

app.get('/Adminmanageuser', (req, res) => {
    res.render('Manage_User', { Users });
});

app.get('/Adminmanageuser/new', (req, res) => {
    res.render('newuser.ejs');
});

app.get('/Adminmanageuser/:id/edit', (req, res) => {
    let { id } = req.params;
    let User = Users.find((p) => id === p.id);
    res.render('edituser.ejs', { User });
});

app.get('/Admin', (req, res) => {
    res.render('Admin', { username: req.session.admin.Username });
});

app.get('/Adminaccount', (req, res) => {
    res.render('Admin_Account', { admin: req.session.admin });
});

app.get('/User', (req, res) => {
    res.render('User', { username: req.session.user.Username });
});

app.get('/Useraccount', (req, res) => {
    res.render('User_Account', { user: req.session.user });
});

app.get('/UserResetpassword', (req, res) => {
    res.render('User_Reset_Password', { user: req.session.user });
});

app.get('/AdminResetpassword', (req, res) => {
    res.render('Admin_Reset_Password', { admin: req.session.admin });
});

app.get('/Userdeleteaccount', (req, res) => {
    res.render('Userdeleteaccount', { user: req.session.user });
});

app.post('/Adminmanageuser', (req, res) => {
    let { Username, Email, Password } = req.body;
    let id = uuidv4();
    Users.push({id, Username, Email, Password});
    res.redirect('/Adminmanageuser');
});

app.post('/AdminLogin', (req, res) => {
    const { username, email, password } = req.body;
    const admin = Admins.find(u => u.Username === username && u.Email === email && u.Password === password);

    if (!admin) {
        return res.send(`
            <script>
                alert("Invalid Admin!");
                window.location.href = "/AdminLogin";
            </script>
        `);
    }
    req.session.admin = admin;
    res.redirect('/Admin');
});

app.post('/UserLogin', (req, res) => {
    const { username, email, password } = req.body;
    const user = Users.find(u => u.Username === username && u.Email === email && u.Password === password);

    if (!user) {
        return res.send(`
            <script>
                alert("Invalid User!");
                window.location.href = "/UserLogin";
            </script>
        `);
    }

    req.session.user = user;
    res.redirect('/User');
});

app.patch('/AdminResetpassword', (req, res) => {
    let newPassword = req.body.password;
    let adminEmail = req.session.admin.Email;
    let admin = Admins.find((a) => a.Email === adminEmail);
    admin.Password = newPassword;
    res.redirect('/Admin');
});

app.patch('/UserResetpassword', (req, res) => {
    let newPassword = req.body.password;
    let userEmail = req.session.user.Email;
    let user = Users.find((a) => a.Email === userEmail);
    user.Password = newPassword;
    res.redirect('/User');
});

app.patch('/Adminmanageuser/:id', (req, res) => {
    let { id } = req.params;
    let Newusername = req.body.Username;
    let newEmail = req.body.Email;
    let newPassword = req.body.Password;
    let User = Users.find((p) => id === p.id);
    User.Email = newEmail;
    User.Username = Newusername;
    User.Password = newPassword;
    res.redirect('/Adminmanageuser');
});

app.delete('/UserdeleteAccount', (req, res) => {
    Users = Users.filter(user => user.id !== req.session.user.id);
    res.redirect('/UserLogin'); 
});

app.delete('/Adminmanageuser/:id', (req, res) => {
    let { id } = req.params;
    Users = Users.filter((p) => id !== p.id);
    res.redirect('/Adminmanageuser');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
