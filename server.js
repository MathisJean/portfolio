
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get('/', (req, res) => res.redirect(301, '/home'));

app.use(express.static('public'));
app.set("view engine", "ejs");

const home_router = require('./routes/home_router');
app.use('/home', home_router);

const projects_router = require('./routes/projects_router');
app.use('/projects', projects_router);

const about_router = require('./routes/about_router');
app.use('/about', about_router);

const contact_router = require('./routes/contact_router');
app.use('/contact', contact_router);

// Optional health check
app.get('/health', (req, res) => res.send('OK'));

// 404 handler
app.use((req, res) =>
{
  res.status(404).render("error");
});


app.listen(port, () =>
{
  console.log(`Server running on port ${port}`);
});