var express = require('express');
var router = express.Router();
var path = require('path');
const shell = require('shelljs');
//var childProcess = require('child_process');
/* GET home page. */


var fs = require('fs');
var multer = require('multer')

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'index.html'));

});


var storage = multer.memoryStorage();

router.post('/upload-images', function (req, res, next) {
    var upload = multer({
        storage: storage
    }).single('file');
    upload(req, res, function (err) {
        var buffer = req.file.buffer;
        var filename = req.file.originalname;
        console.log('/images/' + filename);
        fs.writeFile('/var/www/public/images/' + filename, buffer, 'binary', function (err) {
            if (err) throw err;
        });
    })
    shell.exec('rm /var/www/public/images/filelist.txt');
    shell.exec('ls /var/www/public/images/*.fits >> /var/www/public/images/filelist.txt');
})


router.post('/generate-sextract', function (req, res, next) {
    shell.exec('rm /var/www/public/images/sextract.sh');
    shell.exec('python3 /var/www/public/images/generate_sextract.py');
})


router.post('/source-extract', function (req, res, next) {
    shell.exec('bash /var/www/public/images/sextract.sh');
})


router.post('/ensemble-photometry', function (req, res, next) {
    console.log('Running python')
    shell.exec('python3.6 /var/www/public/images/ensemble.py');
})

module.exports = router;
