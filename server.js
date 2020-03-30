const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.get("*", function(req, res) {
  res.send("tunnel snakes rule")
})

app.listen(PORT, function() {
  console.log(`running on ${PORT}`)
})