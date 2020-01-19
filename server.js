const fastify = require('fastify')({ logger: false })
const request = require('request');

// Declare a route
fastify.get('/api/users/:id', async (req, reply) => {
  var id = req.params.id 

  request.get('https://reqres.in/api/users' + id, function(error, response,body) {
    console.log(body);
    
  })
  
  return { hello: 'world'}

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
