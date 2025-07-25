
//Set up libraries
const https = require('https');
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

//Set view engine
app.set("view engine", "ejs");

//----Using Routers----//

//Home
const home_router = require('./routes/home_router');
app.use('/', home_router);

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

//Create https server
const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem"))
  }, app)

//Start up server
sslServer.listen(port, host, () =>  
{
  console.log(`Server running at https://${host}:${port}/projects close it with CTRL + C`);
});
