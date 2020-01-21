const fastify = require('fastify')({ logger: false })
fastify.register(require('fastify-formbody'))

const request = require('request');



// Declare a route
fastify.post('/status/invoice', async (req, reply) => {

  var body = req.body;
    
  console.log(body);
  var dataString = 'trade=AngN9iijbj8zy6DLY7S71PyPZ2QRPzesDYB2QsHevs25&token=38861362347017244782231884456164422712627029925977603096920990104058295783313&invoice=' + body.invoice_id;

  var headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
  };


  var options = {                                      
      url: 'https://api.forgingblock.io/check-invoice',
      method: 'POST',
      headers: headers,
      body: dataString
  };

  function callback(error, response, body2) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body2);
        var post_data = {};
        post_data["status"] = data.status;
        post_data["btc_address"] = data.payUrl;
        post_data["order_amount"] = data.realAmount;
        post_data["order_amount_fiat"] = data.amount;
        console.log(post_data);
        if (data.status == "expired")
          console.log("expired");
        else if (data.status == "confirmed" || data.status == "complete") {
          console.log("confirmed");
          
        }
        reply.send(post_data);
      }
  }

  request(options, callback);
  
  

})


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

