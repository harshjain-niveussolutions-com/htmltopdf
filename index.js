const express = require('express');
const app = express();
app.use(express.static('public/uploads'))
const multer = require('multer');
const fs = require('fs');
const pdf = require('html-pdf')
const path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
  
  var upload = multer({ storage: storage }).single('file');

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/template2.html')
});

app.post('/htmltopdf',(req,res)=>{
    var output = Date.now()+"ouput.pdf"
    upload(req,res,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(req.file.path)

            var html = fs.readFileSync(req.file.path,"utf8");
            console.log('htmllllllllllllllll',html)
            var options = {
                childProcessOptions: {
                    env: {
                      OPENSSL_CONF: '/dev/null',
                    },
                  },
                format: "A3",
                // orientation: "portrait",
                // border: "10mm",
                // header: {
                //     height: "45mm",
                //     contents: '<div style="text-align: center;">Anything that you want to give</div>'
                // },
                // footer: {
                //     height: "28mm",
                //     contents: {
                //         first: 'Cover page',
                //         2: 'Second page', // Any page number is working. 1-based index
                //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                //         last: 'Last Page'
                //     }
                // }
            };
            // var document = {
            //     html: html,
            //     // data: {
            //     //   users: users,
            //     // },
            //     data:{},
            //     path: "./output.pdf",
            //     type: "",
            //   };

              pdf
              .create(html, options)
              .toFile(output,(err,response)=>{
                if(err) console.log(err);
                else{
                    console.log(response.filename)
                    res.status(200).download(response.filename,()=>{
                        console.log('file downloaed')
                      });
                }
              })

             

        }
    })  
})

app.listen(5000,()=>{
    console.log('listening to port 5000');
})