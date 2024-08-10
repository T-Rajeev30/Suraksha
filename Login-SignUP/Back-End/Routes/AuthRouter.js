const router = require('express').Router();

router.post('/login' , (res, res)=>{
    res.send('login success');
});
router.post('/signup' , (res, res)=>{
    res.send('signup success');
});
module.exports = router;