var path = require("path");
var fs = require("fs");
var express =require("./node_modules/express");
var app=express();
var bodyParser = require('./node_modules/body-parser');
var formidable = require('./node_modules/formidable');
const child_process = require('child_process');
var cv = require('./node_modules/opencv');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/upload"));

app.set('view engine', 'ejs');

app.post('/NCTUface', function (req, res) {
  console.log('face detection now');
  var form = new formidable.IncomingForm();
  var returnData = "";
  //form.encoding = 'utf-8';
  form.uploadDir = path.join(__dirname + "/upload");
  form.keepExtensions = true;
  form.maxFieldsSize = 2 * 1024 * 1024;
  form.parse(req, function (err, fields, files){

      var date = new Date();
      var time = date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" +
                               date.getHours() + "_" + date.getMinutes() + "_" + date.getMilliseconds();
      var avatarName = time + '.png';
      fs.renameSync(files.upload.path, __dirname+"/upload/"+avatarName);
        //console.log("png is uploaded");
        cv.readImage("./upload/"+avatarName, function(err, im){
          if (err) throw err;
          if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
          im.detectObject("./node_modules/opencv/data/haarcascade_frontalface_alt.xml", {}, function(err, faces){
            if (err) throw err;
            for (var i = 0; i < faces.length; i++){
              var face = faces[i];
              im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2, color=(128,255,0), thickness=10, lineType=80, shift=0);
            }
            im.save("./detected/face_"+avatarName);

            //returnData=fs.readFileSync("./detected/face_"+avatarName,'base64');
           returnData=fs.readFileSync("./detected/face_"+avatarName,'base64');
            //fs.unlink("./upload/"+avatarName);
            //res.send('<img src="data:image/png;base64,'+returnData+'">');
            //console.log(returnData);
            //res.send(returnData);
            res.send(returnData);
            fs.unlinkSync("./detected/face_"+avatarName);
            fs.unlinkSync("./upload/"+avatarName);
            });
          });
      })
})

app.listen(5000, function () {
  console.log('app listening on port 5000')
})
