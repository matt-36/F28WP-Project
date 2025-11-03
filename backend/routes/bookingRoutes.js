const db = require('utils.dbConnection.js');
const url = require('url');

function handleBookingRoutes(req, res) {
  const parsedURL = url.parse(req.url, true);
  const pathname = parsedURL.pathname;
  const method = req.method;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control_Allow-Methods", "GET, POST", "DELETE");

  if (method === "GET" && pathname.startsWith("/booking/users")) {
    const userID = pathname.split("/")[3];
  
  }
}