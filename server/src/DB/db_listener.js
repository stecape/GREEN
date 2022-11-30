/////////////////////Event Listener Stuff///////////////////////////////

module.exports = function (connection, pool) {
  return new Promise((innerResolve, reject) => {  
    innerResolve(pool)


    // Creating the connection that will remains on listen for notifications
    pool.connect(function(err, client) {
      if(err) {
        console.log(err)
      }else{
        console.log ("pool connected")
      }

      // Listen for all pg_notify channel messages
      client.on('notification', function(msg) {
        let payload = JSON.parse(msg.payload)
        console.log(payload)
        connection.emit('update', payload)
      })
      
      // Designate which channels we are listening on. Add additional channels with multiple lines.
      client.query('LISTEN changes')
    })

  }
)}
/////////////////////Event Listener Stuff Fine///////////////////////////////