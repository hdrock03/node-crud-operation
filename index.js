const config = require('config')
const debug = require('debug')('app:startup')// app:startup function hai
const Joi = require('joi')
const helmet = require('helmet') 
const morgan = require('morgan')
const logger = require('./middleware/logger')
const courses = require('./routes/courses')
const home = require('./routes/home')
const express = require('express') 
const app = express();

app.set('view engine','pug')// 1st argument is property and second is templating engine is pug so express will internally load this modal 
app.set('views','./views') // this id default so no need to write

app.use(express.json()) // middleware 
app.use(express.urlencoded({extended : true}))
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses)// here we are using path and 2nd courses so we r telling any route /api/courses will be loaded from courses module
app.use('/', home)


// // Configuration
// console.log('Application name:' + config.get('name'));
// console.log('Mail Server:' + config.get('mail.host'));

app.use(logger)

if(app.get('env') === 'development') {
    app.use(morgan('tiny'))
    debug('Morgan enabled') // console.log()
}






const port = process.env.PORT || 3000 

app.listen(port, ()=> { 
    console.log(`Listening on port ${port}`);
})