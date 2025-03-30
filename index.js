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

app.get("/", (req, res) => {
    const homepageQuery = "SELECT title FROM homepagenewupdates";
    const gridQuery = "SELECT title FROM homepagegridupdates";
    const jobQuery = "SELECT title FROM homepagejobnotifications";  
    const jobQuerytwo = "SELECT title FROM homepagejobnotificationstwo";

    connection.query(homepageQuery, (err, homepageResults) => {
        connection.query(gridQuery, (err, gridResults) => {
            connection.query(jobQuery, (err, jobResults) => { 
                connection.query(jobQuerytwo, (err, jobResultstwo) => { 
                    res.render("DreamJob_1", { homepageResults: homepageResults, gridResults: gridResults, jobs: jobResults, jobstwo: jobResultstwo });
                });
            });
        });
    });
});

app.get('/ContactUs', (req, res) => {
    res.render('Contact_Us');
});

app.get('/search', (req, res) => {
    const searchTerm = req.query.query;

    const Pages = {
        "contact us": "/ContactUs",
        "home": "/",
        "AP": "/state/AP_state", "AS": "/state/AS_state", "BR": "/state/BR_state", "CG": "/state/CG_state",
        "DL": "/state/DL_state","GJ": "/state/GJ_state","HP": "/state/HP_state", "HR": "/state/HR_state",
        "JH": "/state/JH_state", "KA": "/state/KA_state", "KL": "/state/KL_state", "MH": "/state/MH_state",
        "MP": "/state/MP_state", "OD": "/state/OD_state", "PB": "/state/PB_state", "RJ": "/state/RJ_state",
        "TN": "/state/TN_state", "TS": "/state/TS_state", "UK": "/state/UK_state", "UP": "/state/UP_state",
        "WB": "/state/WB_state",
        "All india govt job": "/jobs/All_India_Govt_job",
        "State govt job": "/jobs/State_Govt_Job",
        "Bank job": "/jobs/Bank_Job",
        "Teaching job": "/jobs/Teaching_Job",
        "Engineering job": "/jobs/Engineering_Job",
        "Railways job": "/jobs/Railways_Job",
        "Police defence job": "/jobs/Police_Defence_Job",
        "Admin login": "/AdminLogin",
        "User login": "/UserLogin",
        "Latest notification": "/Latestnotification",
        "Upcoming notifications": "/Upcomingnotification",
        "Notification status": "/Notificationstatus",
        "Cutoff marks": "/Cutoffmarks",
        "Interview results": "/Interviewresults",
        "Eligibility": "/Eligibility",
        "Selection process": "/Selectionprocess"
    };

    if (Pages[searchTerm]) {
        return res.redirect(Pages[searchTerm]);
    }
});

app.get('/state/:state', (req, res) => {
    let { state} = req.params;
    res.render(`${state}`);
});

app.get('/jobs/:category', (req, res) => {
    let {category} = req.params;
    res.render(`${category}`);
});

app.get('/Latestnotification', (req, res) => {
    res.render("Latest_notification");
});

app.get('/Upcomingnotification', (req, res) => {
    res.render("Upcoming_notifications");
});

app.get('/Notificationstatus', (req, res) => {
    res.render("Notification_status");
});

app.get('/Cutoffmarks', (req, res) => {
    res.render("Cutoff_marks");
});

app.get('/Interviewresults', (req, res) => {
    res.render("Interview_results");
});

app.get('/Eligibility', (req, res) => {
    res.render('Eligibility');
});

app.get('/Selectionprocess', (req, res) => {
    res.render('Selection_process');
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

app.get('/usersearch', (req, res) => {
    const searchTerm = req.query.query;

    const Pages = {
        "contact us": "/ContactUs",
        "home": "/",
        "AP": "/state/AP_state", "AS": "/state/AS_state", "BR": "/state/BR_state", "CG": "/state/CG_state",
        "DL": "/state/DL_state","GJ": "/state/GJ_state","HP": "/state/HP_state", "HR": "/state/HR_state",
        "JH": "/state/JH_state", "KA": "/state/KA_state", "KL": "/state/KL_state", "MH": "/state/MH_state",
        "MP": "/state/MP_state", "OD": "/state/OD_state", "PB": "/state/PB_state", "RJ": "/state/RJ_state",
        "TN": "/state/TN_state", "TS": "/state/TS_state", "UK": "/state/UK_state", "UP": "/state/UP_state",
        "WB": "/state/WB_state",
        "All india govt job": "/jobs/All_India_Govt_job",
        "State govt job": "/jobs/State_Govt_Job",
        "Bank job": "/jobs/Bank_Job",
        "Teaching job": "/jobs/Teaching_Job",
        "Engineering job": "/jobs/Engineering_Job",
        "Railways job": "/jobs/Railways_Job",
        "Police defence job": "/jobs/Police_Defence_Job",
        "Admin login": "/AdminLogin",
        "User login": "/UserLogin",
        "Latest notification": "/Latestnotification",
        "Upcoming notifications": "/Upcomingnotification",
        "Notification status": "/Notificationstatus",
        "Cutoff marks": "/Cutoffmarks",
        "Interview results": "/Interviewresults",
        "Eligibility": "/Eligibility",
        "Selection process": "/Selectionprocess"
    };

    if (Pages[searchTerm]) {
        return res.redirect(Pages[searchTerm]);
    }
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

app.get('/adminsearch', (req, res) => {
    const searchTerm = req.query.query;

    const Pages = {
        "contact us": "/ContactUs",
        "home": "/",
        "AP": "/state/AP_state", "AS": "/state/AS_state", "BR": "/state/BR_state", "CG": "/state/CG_state",
        "DL": "/state/DL_state","GJ": "/state/GJ_state","HP": "/state/HP_state", "HR": "/state/HR_state",
        "JH": "/state/JH_state", "KA": "/state/KA_state", "KL": "/state/KL_state", "MH": "/state/MH_state",
        "MP": "/state/MP_state", "OD": "/state/OD_state", "PB": "/state/PB_state", "RJ": "/state/RJ_state",
        "TN": "/state/TN_state", "TS": "/state/TS_state", "UK": "/state/UK_state", "UP": "/state/UP_state",
        "WB": "/state/WB_state",
        "All india govt job": "/jobs/All_India_Govt_job",
        "State govt job": "/jobs/State_Govt_Job",
        "Bank job": "/jobs/Bank_Job",
        "Teaching job": "/jobs/Teaching_Job",
        "Engineering job": "/jobs/Engineering_Job",
        "Railways job": "/jobs/Railways_Job",
        "Police defence job": "/jobs/Police_Defence_Job",
        "Admin login": "/AdminLogin",
        "User login": "/UserLogin",
        "Latest notification": "/Latestnotification",
        "Upcoming notifications": "/Upcomingnotification",
        "Notification status": "/Notificationstatus",
        "Cutoff marks": "/Cutoffmarks",
        "Interview results": "/Interviewresults",
        "Eligibility": "/Eligibility",
        "Selection process": "/Selectionprocess",
        "Manage users": "/Adminmanageuser",
        "Manage content": "/Adminmanagecontent",
        "Edit home page": "/Admin_home",
        "Edit AP state page": "/adminstate/Admin_AP_state",
        "Edit AS state page": "/adminstate/Admin_AS_state",
        "Edit BR state page": "/adminstate/Admin_BR_state",
        "Edit CG state page": "/adminstate/Admin_CG_state",
        "Edit DL state page": "/adminstate/Admin_DL_state",
        "Edit GJ state page": "/adminstate/Admin_GJ_state",
        "Edit HP state page": "/adminstate/Admin_HP_state",
        "Edit HR state page": "/adminstate/Admin_HR_state",
        "Edit JH state page": "/adminstate/Admin_JH_state",
        "Edit KA state page": "/adminstate/Admin_KA_state",
        "Edit KL state page": "/adminstate/Admin_KL_state",
        "Edit MH state page": "/adminstate/Admin_MH_state",
        "Edit MP state page": "/adminstate/Admin_MP_state",
        "Edit OD state page": "/adminstate/Admin_OD_state",
        "Edit PB state page": "/adminstate/Admin_PB_state",
        "Edit RJ state page": "/adminstate/Admin_RJ_state",
        "Edit TN state page": "/adminstate/Admin_TN_state",
        "Edit TS state page": "/adminstate/Admin_TS_state",
        "Edit UK state page": "/adminstate/Admin_UK_state",
        "Edit UP state page": "/adminstate/Admin_UP_state",
        "Edit WB state page": "/adminstate/Admin_WB_state"
    };

    if (Pages[searchTerm]) {
        return res.redirect(Pages[searchTerm]);
    }
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

app.get('/Adminmanagecontent', (req,res) => {
    res.render('Admin_manage_content');
});

app.get('/Admin_home', (req,res) => {
    const homepageQuery = "SELECT id, title FROM homepagenewupdates";
    const gridQuery = "SELECT id, title FROM homepagegridupdates";
    const jobQuery = "SELECT id, title FROM homepagejobnotifications";  
    const jobQuerytwo = "SELECT id, title FROM homepagejobnotificationstwo";

    connection.query(homepageQuery, (err, homepageResults) => {
        connection.query(gridQuery, (err, gridResults) => {
            connection.query(jobQuery, (err, jobResults) => { 
                connection.query(jobQuerytwo, (err, jobResultstwo) => { 
                    res.render("Admin_home", { homepageResults: homepageResults, gridResults: gridResults, jobs: jobResults, jobstwo: jobResultstwo });
                });
            });
        });
    });
});

app.get('/homepageupdatenew', (req, res) =>{
    res.render("homepageupdatenew");
});

app.post('/homepageupdatesnew', (req, res) => {
    const { NewUpdate } = req.body;
    const id = uuidv4();

    connection.query('INSERT INTO homepagenewupdates (id, title) VALUES (?, ?)', 
    [id, NewUpdate], (err) => {
        if (err) throw err;
        res.redirect('/Admin_home');
    });
});

app.get('/homepageupdateedit/:id/edit', (req, res) => {
    connection.query('SELECT * FROM homepagenewupdates WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('homepageupdateedit.ejs', { update: results[0] });
    });
});

app.patch('/homepageupdateedit/:id', (req, res) => {
    if (!req.session.admin) return res.redirect('/Admin_home');

    const { id } = req.params;
    const Editupdate = req.body.Editupdate;
    connection.query('UPDATE homepagenewupdates SET title = ? WHERE id = ?', [Editupdate, id], (err) => {
        if (err) throw err;
        res.redirect('/Admin_home');
    });
});

app.delete('/homepageupdatedelete/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM homepagenewupdates WHERE id = ?', [id], (err) => {
        if (err) throw err;
        req.session.destroy();
        res.redirect('/Admin_home');
    });
});

app.get('/homepagegridnew', (req, res) =>{
    res.render("homepagegridnew");
});

app.post('/homepagegridnew', (req, res) => {
    const { NewGrid } = req.body;
    const id = uuidv4();

    connection.query('INSERT INTO homepagegridupdates (id, title) VALUES (?, ?)', 
    [id, NewGrid], (err) => {
        if (err) throw err;
        res.redirect('/Admin_home');
    });
});

app.get('/homepagegrid/:id/edit', (req, res) => {
    connection.query('SELECT * FROM homepagegridupdates WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('homepagegridedit', { gridResults: results[0] });
    });
});

app.patch('/homepagegrid/:id', (req, res) => {
    if (!req.session.admin) return res.redirect('/Admin_home');

    const { id } = req.params;
    const Editgrid = req.body.Editgrid;
    connection.query('UPDATE homepagegridupdates SET title = ? WHERE id = ?', [Editgrid, id], (err) => {
        if (err) throw err;
        res.redirect('/Admin_home');
    });
});

app.delete('/homepagegriddelete/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM homepagegridupdates WHERE id = ?', [id], (err) => {
        if (err) throw err;
        req.session.destroy();
        res.redirect('/Admin_home');
    });
});

app.get('/homepagejobsnew', (req, res) =>{
    res.render("homepagejobsnew");
});

app.post('/homepagejobsnew', (req, res) => {
    const { Newjob } = req.body;
    const id = uuidv4();

    connection.query('INSERT INTO homepagejobnotifications (id, title) VALUES (?, ?)', 
    [id, Newjob], (err) => {
        if (err) throw err;
        res.redirect('/Admin_home');
    });
});

app.get('/homepagejobs/:id/edit', (req, res) => {
    connection.query('SELECT * FROM homepagejobnotifications WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('homepagejobsedit', { job: results[0] });
    });
});

app.patch('/homepagejobs/:id', (req, res) => {
    if (!req.session.admin) return res.redirect('/Admin_home');

    const { id } = req.params;
    const Editjob = req.body.Editjob;
    connection.query('UPDATE homepagejobnotifications SET title = ? WHERE id = ?', [Editjob, id], (err) => {
        if (err) throw err;
        res.redirect('/Admin_home');
    });
});

app.delete('/homepagejobsdelete/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM homepagejobnotifications WHERE id = ?', [id], (err) => {
        if (err) throw err;
        req.session.destroy();
        res.redirect('/Admin_home');
    });
});

app.get('/adminstate/:state', (req, res) => {
    let { state} = req.params;
    res.render(`${state}`);
});

app.get('/adminjobs/:category', (req, res) => {
    let {category} = req.params;
    res.render(`${category}`);
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
