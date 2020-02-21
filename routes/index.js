const router = require("express").Router();

let controller = require("../src/controllers/UrlController");

/* GET home page. */
router.get('/', controller.list);
router.post('/create', controller.create);
router.get('/getUrlOf/:id', controller.getUrlOfItem);
router.get('/paginate', controller.paginate);
router.get('/qrcode/:id', controller.qrcode);

module.exports = router;
