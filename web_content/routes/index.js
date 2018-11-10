var express = require('express');
var router = express.Router();
var path = require('path');
//var childProcess = require('child_process');
var fs = require('fs');
var multer  = require('multer')
var uploadimage = multer( { dest: 'images/' } );

/* GET home page. */
router.get('/', function(req, res, next) 
{
  //req.body.username
  //res.render('index', { title: 'Express' });
  //res.send("Hello");
  res.sendFile(path.join(__dirname, '../', 'index.html'));
  
});


var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, 'images/')
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

router.post('/upload-images', uploadimage.single( 'file' ), function(req, res) {
  var upload = multer({
    storage: storage.memoryStorage()
  }).single('userFile');
  console.log(upload);
  upload(req, res, function (err) {
    var buffer = req.file.buffer;
    var filename = req.file.fieldname + path.extname(req.file.originalname);
    console.log('images/' + filename);
    fs.writeFile('images/' + filename, buffer, 'binary', function (err) {
          if (err) throw err
          res.end('File is uploaded')
    });
  })
})

/*
router.post('/upload-images', upload.single( 'file' ), function(req, res, next){

console.log(req.file);



fs.readFile(req.file, function (err, req) {
  var newPath = req.destination + req.originalname;
  fs.writeFile(newPath, data, function (err) {
    res.redirect("back");
  });
});

});
*/

router.post('/get_files', function(req, res, next) 
{
  //console.log(req.body);
  var selected_rows = req.body;
  var query_string = 'SELECT __filename from allkeys WHERE __obsnum IN (' + selected_rows + ') ';
  
  pool.query(query_string, (err, result) => {
    if (err) {
      return console.log(err.stack)
    }
    var result_formatted = [];
    //console.log(result.rows.length);
    for (var i=0; i<result.rows.length; i++) {
      //console.log(result.rows[i].__filename);
      result_formatted.push(result.rows[i].__filename);
    }
    console.log(result_formatted);
    // Need full path here
    var filename = 'temp_files/fileList_' + Date.now() + '.txt';
    var filepath = path.join('/home/dbuser/DataArchive/pg-express-angularjs/public', filename);
    console.log(filename);

    fs.writeFileSync(filepath, result_formatted, function(err) {
      if(err) {
        return console.log(err);
      }
      else {
        console.log("File created.");
      }
    });

    // Only send back public path here
    res.send(filename);
    console.log(filename);
    
  })

});

module.exports = router;

