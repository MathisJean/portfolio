
//Set up libraries
const http = require('http');
const os = require('os');

const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

let host = "localhost";
let port = process.env.PORT || 3000;

//Get dymamic IP address
const networkInterfaces = os.networkInterfaces();

for (const iface of Object.values(networkInterfaces))
{
  for (const ifaceInfo of iface) 
  {
    if (ifaceInfo.family === "IPv4" && !ifaceInfo.internal) 
    {
      host = ifaceInfo.address;
    };
  };
};

app.use(express.json({ limit: "10mb" })); // Increase limit to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => res.redirect(301, '/home'));

app.use(express.static('public'));
app.set("view engine", "ejs");

//----Using Routers----//

//Home
const home_router = require('./routes/home_router');
app.use('/home', home_router);

//Projects
const projects_router = require('./routes/projects_router');
app.use('/projects', projects_router);

//About
const about_router = require('./routes/about_router');
app.use('/about', about_router);

//Contact
const contact_router = require('./routes/contact_router');
app.use('/contact', contact_router);

//Error
app.use((req, res) => 
{
  res.status(404).render("error");
});

const http_server = http.createServer(app);

//Start up server
http_server.listen(port, host, () => 
{
  console.log(`Server running at http://${host}:${port} close it with CTRL + C`);
});
