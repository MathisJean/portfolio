
//Set up libraries
const fs = require('fs');
const path = require('path');

const express = require('express')
const router = express.Router()

//Setup Router
router.get('/', (req, res) => 
{
  res.render("projects")
})

//Export router to server file
module.exports = router