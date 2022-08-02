const Joi = require('joi')
const helmet = require('helmet') 
const morgan = require('morgan')
const logger = require('./logger')
const express = require('express') 
const app = express();

app.use(express.json()) // middleware 
app.use(express.urlencoded({extended : true}))
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'))

app.use(logger)



const courses = [
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'}
]

app.get('/', (req, res) => { 
    res.send('hello World!!') 
})

app.get('/api/courses', (req,res)=>{
    res.send(courses) // yeh array of object bhejega browser me
})

app.post('/api/courses',(req, res) => {
  
    const {error} = validateCourse(req.body)
    console.log(error);
    if(error) {
        res.status(400).send(error.details[0].message)
        return;
    }

    const course = { 
        id: courses.length + 1,
        name: req.body.name 
    }
    courses.push(course);
    res.send(course) 
})

app.put('/api/courses/:id', (req, res) => {
    //Look up the course
    //If not existing, return 404 - resource not found
    const course = courses.find(c => c.id ===parseInt(req.params.id))
    if(!course) {
      return res.status(404).send('the course with given id is not available')
    }
    //validate
    //if invalid, return 400 - Bad request
    // const schema = Joi.object({
    //     name: Joi.string().min(3).required() 
    // })

    // const {error}= schema.validate(req.body); 

    const {error} = validateCourse(req.body)
    console.log(error);
    if(error) {
        res.status(400).send(error.details[0].message)
        return;
    }


    //Update the course
    course.name = req.body.name
    // return the updated course to client
    res.send(course)

})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required() 
    })

    return schema.validate(course);
}

app.get('/api/courses/:id', (req,res)=> {
    const course = courses.find(c => c.id ===parseInt(req.params.id))
    if(!course) res.status(404).send('the course with given id is not available')
    res.send(course)
})

const port = process.env.PORT || 3000 

app.listen(port, ()=> { 
    console.log(`Listening on port ${port}`);
})

app.delete('/api/courses/:id' , (req, res) => {
    //look up the course
    // not existing, return 404
    const course = courses.find(c => c.id ===parseInt(req.params.id))
    if(!course) res.status(404).send('the course with given id is not available')

    //delete
    const index = courses.indexOf(course);
    courses.splice(index,1)

    // return the same course
    res.send(course)
})