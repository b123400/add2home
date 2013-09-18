var fs = require('fs');
var path = require('path');

var mimeTypes = {};

exports.upload = function(req, res){

  if( !req.files.file || !req.body.uuid ){
    res.json({
      status : "error",
      fuck   : "no file or uuid"
    });
    console.log('fuck upload');
    return;
  }
  console.log(req.files.file);
  var mime = req.files.file.mime || req.files.file.headers['content-type'];
  if( mime.indexOf('image') == -1 ){
    res.json({
      fuck : 'not supported mime type'
    });
    return;
  }

  fs.readFile(req.files.file.path, function (err, data) {
    var newPath = path.join(__dirname, '../uploads/', req.body.uuid);
    fs.writeFile(newPath, data, function (err) {
      if(err){
        console.log('upload read error'+err);
        res.end('error3');
        return;
      }

      mimeTypes[req.body.uuid] = mime;

      //delete image after 10 minutes
      setTimeout(function(){
        try{
          fs.unlink(newPath,function(err){});
        }catch(e){}
        delete mimeTypes[req.body.uuid];
      },6000*10);

      res.json({
        status:"done"
      });

    });
  });
};

var request = require('request');

exports.generate = function (req, res) {

  if( !req.query.uuid ){
    req.query.uuid = req.query.u;
  }

  if( !req.query.uuid || !req.query.url ){
    res.end('error');
    return;
  }

  var imagePath = path.join(__dirname, '../uploads/', req.query.uuid);

  fs.readFile(imagePath, function(err, data){
    if(err){
      res.end('error1');
      return;
    }

    var base64Image = data.toString('base64');

    var type = mimeTypes[req.query.uuid] || "image/png";

    base64Image = "data:"+type+";base64,"+base64Image;

    var url = req.query.url;

    if( req.query.url.substr(0,7) != "http://" || req.query.url.substr(0,8) != "https://" ){
      url = "http://"+url;
    }

    res.render('generate',{
      "imageurl" : base64Image,
      "url" : url
    },
    function(err,html){
      if(err){
        res.end('error2');
        return;
      }
      var base64html = new Buffer(html).toString('base64');

      res.render("redirect",{
        url : "data:text/html;charset=utf-8;base64,"+base64html
      });
    });
  });
}

exports.result = function(req, res){

  if( !req.query.uuid || !req.query.url ){
    res.end('error/expired');
    return;
  }

  var url = req.query.url;

  var iosURL = "http://add2home.b123400.net/g?u="+req.query.uuid+"&url="+url;

  request('http://is.gd/create.php?format=simple&url='+encodeURIComponent(iosURL), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render("result",{
        uuid : response.body
      });
    }else{
      console.log('is.gd error'+error,response);
      res.render("result",{
        uuid : iosURL
      });
    }
  });
}