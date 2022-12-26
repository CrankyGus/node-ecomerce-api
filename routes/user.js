const router = require('express').Router()

router.get('/users',(req,res)=>{
    res.send('Hello World')
})

module.exports = router