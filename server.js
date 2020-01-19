const fastify = require('fastify')({ logger: false })
const request = require('request');
const http = require('http');
const fs = require('fs');
const base64Img = require('base64-img');


// Declare a route
fastify.get('/api/user/:id', async (req, reply) => {
  var id = req.params.id 

  request.get('https://reqres.in/api/users/' + id, function(error, response,body) {
    //console.log(body);
    
  })
  
  return { hello: 'world'}

})

fastify.get('/api/user/:id/avatar', async (req, reply) => {
  var id = req.params.id 

  request.get('https://reqres.in/api/users/' + id , function(error, response,body) {
    body = JSON.parse(body)
    console.log(body);
    //console.log(body.data.avatar);

      if (fs.existsSync('./' + id + '.jpg')) {
        console.log(id + ' exists');
        fs.readFile('./' + id + '.jpg', function read(err, data) {
          if (err) {
           throw err;  
          }
          var img_data = base64Img.base64Sync('./' + body.data.id + '.jpg');
          reply.send(img_data);
        });
      }
      else  {
        console.log("file doesnt exists")
        download(body.data.avatar, id + '.jpg', function(){
          console.log(id + ' doesnt exists. Downloading');
          var img_data = base64Img.base64Sync('./' + body.data.id + '.jpg');
          reply.send(img_data);
        });
      }
    
    
  })

}) 

fastify.delete('/api/user/:id/avatar', async (req, reply) => {
  var id = req.params.id;

  if (fs.existsSync('./' + id + '.jpg')) {
    try {
      fs.unlinkSync('./' + id + '.jpg'); // delete file
      reply.send('successfully deleted ' + id + '.jpg');
    } catch (err) {
      // handle the error
    }
  } else {
    reply.send("File doesnt exists");
  }

})

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
