var express = require('express');
var router = express.Router();
var index_controller = require('../controllers/indexController');

/* GET home page. */
router.get('/create_database/:docs_number', index_controller.create_database);
router.get('/modify_database/:docs_number/:percentage', index_controller.modify_database);
router.get('/view_database', index_controller.view_database);
router.get('/delete_database', index_controller.delete_database);

module.exports = router;
