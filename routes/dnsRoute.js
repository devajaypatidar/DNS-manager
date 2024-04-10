const express = require('express');
const router = express.Router();

const {getMultiDNS,createOneDNS,createMultipleDNS,updateDNS,deleteDNS} = require('../controller/dns/dnsController')


router.post('/all',getMultiDNS);
router.post('/create/one',createOneDNS );
router.post('/create/multiple',createMultipleDNS);
router.post('/update',updateDNS);
router.post('/delete',deleteDNS)



module.exports = router