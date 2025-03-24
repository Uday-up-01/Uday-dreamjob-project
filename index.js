const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodoverride = require('method-override');
const session = require('express-session');
const mysql = require('mysql2');

app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Udaymysql',
    database: 'dreamjob'
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to Database");
});

app.get('/', (req, res) => {
    res.render('DreamJob_1');
});

app.get('/ContactUs', (req, res) => {
    res.render('Contact_Us');
});

app.get('/state/:state', (req, res) => {
    let { state} = req.params;
    res.render(`${state}`);
});

app.get('/jobs/:category', (req, res) => {
    let {category} = req.params;
    res.render(`${category}`);
});

app.get('/NewAdmin', (req, res) => {
    res.render('/AdminLogin');
});

app.post('/NewAdmin', (req, res) => {
    const { username, email, password } = req.body;
    const id = uuidv4();

    connection.query('INSERT INTO admins (id, username, email, password) VALUES (?, ?, ?, ?)', 
    [id, username, email, password], (err) => {
        if (err) throw err;
            res.redirect('/AdminLogin');
        }
    );
});

app.get('/NewUser', (req, res) => {
    res.render('/UserLogin');
});

app.post('/NewUser', (req, res) => {
    const { username, email, password } = req.body;
    const id = uuidv4();

    connection.query('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)', 
    [id, username, email, password], (err) => {
        if (err) throw err;
            res.redirect('/UserLogin');
        }
    );
});

app.get('/UserLogin', (req, res) => {
    res.render('User_Login', { post: {} });
});

app.post('/UserLogin', (req, res) => {
    const { username, password } = req.body;
    
    connection.query(
        'SELECT * FROM users WHERE Username = ? AND Password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database error.");
            }
            if (results.length === 0) {
                return res.send(`
                    <script>
                        alert("Invalid User!");
                        window.location.href = "/UserLogin";
                    </script>
                `);
            }
            req.session.user = results[0];
            res.redirect('/User');
        }
    );
});

app.get('/User', (req, res) => {
    if (!req.session.user) return res.redirect('/UserLogin');
    res.render('User', { username: req.session.user.username });
});

app.get('/AdminLogin', (req, res) => {
    res.render('Admin_Login', { post: {} });
});

app.post('/AdminLogin', (req, res) => {
    const { username, password } = req.body;
    
    connection.query(
        'SELECT * FROM admins WHERE Username =  ? AND Password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database error.");
            }
            if (results.length === 0) {
                return res.send(`
                    <script>
                        alert("Invalid Admin!");
                        window.location.href = "/AdminLogin";
                    </script>
                `);
            }
            req.session.admin = results[0];
            res.redirect('/Admin');
        }
    );
});

app.get('/Admin', (req, res) => {
    if (!req.session.admin) return res.redirect('/AdminLogin');
    res.render('Admin', { username: req.session.admin.username });
});

app.get('/Adminmanageuser', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.render('Manage_User', { Users: results });
    });
});

app.get('/Adminmanageuser/new', (req, res) => {
    res.render('newuser.ejs');
});

app.post('/Adminmanageuser', (req, res) => {
    const { Username, Email, Password } = req.body;
    const id = uuidv4();

    connection.query('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)', 
    [id, Username, Email, Password], (err) => {
        if (err) throw err;
        res.redirect('/Adminmanageuser');
    });
});

app.get('/Adminmanageuser/:id/edit', (req, res) => {
    connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('edituser.ejs', { User: results[0] });
    });
});

app.patch('/Adminmanageuser/:id', (req, res) => {
    const { Username, Email, Password } = req.body;

    connection.query(
        'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
        [Username, Email, Password, req.params.id],
        (err) => {
            if (err) throw err;
            res.redirect('/Adminmanageuser');
        }
    );
});

app.delete('/Adminmanageuser/:id', (req, res) => {
    connection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
        if (err) throw err;
        res.redirect('/Adminmanageuser');
    });
});

app.get('/UserResetpassword', (req, res) => {
    res.render('User_Reset_Password', { user: req.session.user });
});

app.patch('/UserResetpassword', (req, res) => {
    const newPassword = req.body.password;
    connection.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, req.session.user.id], (err) => {
        if (err) throw err;
        res.redirect('/User');
    });
});

app.get('/Useraccount', (req, res) => {
    res.render('User_Account', { user: req.session.user }); 
});

app.get('/Adminaccount', (req, res) => {
    res.render('Admin_Account', { admin: req.session.admin });
});

app.get('/AdminResetpassword', (req, res) => {
    res.render('Admin_Reset_Password', { admin: req.session.admin });
});

app.patch('/AdminResetpassword', (req, res) => {
    if (!req.session.admin) return res.redirect('/AdminLogin');

    const newPassword = req.body.password;
    connection.query('UPDATE admins SET password = ? WHERE id = ?', [newPassword, req.session.admin.id], (err) => {
        if (err) throw err;
        res.redirect('/Admin');
    });
});

app.get('/UserdeleteAccount', (req, res) => {
    res.render('Userdeleteaccount', { user: req.session.user });
});

app.delete('/UserdeleteAccount', (req, res) => {
    connection.query('DELETE FROM users WHERE id = ?', [req.session.user.id], (err) => {
        if (err) throw err;
        req.session.destroy();
        res.redirect('/UserLogin');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
