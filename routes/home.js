const express = require('express')
const router = express.Router()

router.get('/', (req, res) => { 
    // res.send('hello World!!') 
    res.render('index',{title:'my express app' , message:'hello'})// do parameter leta hai name of view file and argument inside that file
})

module.exports = router