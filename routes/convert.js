var express = require('express');
var fs = require('fs');
var mergeImg = require('merge-img');
var path = require('path');
var uniqueFileName = require('unique-filename');

const symbols = '!?"()@&*[]<>{}.,:;-\'';
const alphanuml = 'qwertyuiopasdfghjklzxcvbnm1234567890';
const alphanumu = 'QWERTYUIOPASDFGHJKLZXCVBNM';

var router = express.Router();

router.post('/', async function(req, resp, next) {
  var inputFile = req.files.inputFile;
  var fileName = path.basename(inputFile.name, '.txt');
  var uniqueFile = uniqueFileName('',fileName)
  var fileDir = __dirname + '\\..\\public\\textFiles\\' + uniqueFile + '.txt';
  var success = false;
  
  inputFile.mv(fileDir);

  fs.readFile(fileDir, 'utf-8' , async (err, text) => {
    if(err) {
      resp.json({
        "success": false,
        "message": "Something Went Wrong. Please Try Again later."
      })
    }
    if(text.length !== 0){
      const all = [];
      let res = [];
      for(let i=0; i<text.length; i++) {
        if(alphanuml.includes(text[i])) {
          res.push(`${__dirname}\\../public/dataset/${text[i]}${Math.floor(Math.random() * 6 ) + 1}.jpg`);
        }
        else if(alphanumu.includes(text[i])) {
          res.push(`${__dirname}\\../public/dataset/${Math.floor(Math.random() * 6 ) + 1}${text[i]}.jpg`);
        } 
        else if(symbols.includes(text[i])) {
          res.push(`${__dirname}\\../public/dataset/symbol${symbols.indexOf(text[i])}${Math.floor(Math.random() * 6 ) + 1}.jpg`);
        }
        else if(text[i] === '\n') {
          if (res.length !== 0) {
            all.push(res);
            res = [];
          }
        } 
        else {
          res.push(`${__dirname}\\../public/dataset/unk${Math.floor(Math.random() * 6 ) + 1}.jpg`);
        }
      }
      if (res.length !== 0) {
        all.push(res);
      }
      if(all.length !== 0) {
        let m = all[0].length;
        for(let i=1; i<all.length; i++) {
          if (all[i].length > m) {
            m = all[i].length;
          }
        }

        for(let i=0; i<all.length; i++) {
          while (all[i].length !== m) {
            all[i].push(`${__dirname}\\../public/dataset/unk${Math.floor(Math.random() * 6 ) + 1}.jpg`);
          }
        }
        
        const k = [];
        for (let i = 0; i < all.length; i++) {
          const img = await mergeImg(all[i]);

          k.push(img);
        }

        const img2 = await mergeImg(k, {
          direction: true,
        });
        var imgDir = __dirname + '\\..\\public\\images\\' + uniqueFile + '.jpg';
        await img2.write(imgDir);
        resp.json({
          "success": true,
          "imgaddress": `images/${uniqueFile}.jpg`
        });
        setTimeout(function() {
          fs.unlink(fileDir, (err) => {
            if(err) next(err);
          });
          fs.unlink(imgDir, (err) => {
            if(err) next(err);
          });
        },300000);
      }
    }
  });
});

module.exports = router;
