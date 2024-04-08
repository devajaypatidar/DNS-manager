const express = require('express');
const router = express.Router();
const {registerDomain,getDomain,deleteDomain,domainInfo} = require('../controller/Domain/domainController');

// api - /domain
router.get("/",domainInfo)
router.get('/all', getDomain);
router.post('/register',registerDomain);
router.delete('/delete', deleteDomain);

module.exports = router;