const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");


// gets all of a users bookings
router.get("/users/:userID", (req, res) => {
  const userID = req.params.userID;

  try {
    const result = db.query(
      "SELECT * FROM Bookings WHERE renterID = $1", [userID]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetchign user bookings:", err);
    res.status(500).json({error: "Database error"});
  }
});

// create a new booking
router.post("/", (req, res) => {
  const {propertyID, renterID, startDate, endDate} = req.body;

  try {
    // get price per night
    const priceResult = db.query(
      `SELECT pricePerNight FROM Properties WHERE propertyID = $1`, [propertyID]
    );
    if (priceResult.rowCount === 0) {
      return res.status(404).json({error: "Property not found"});
    }
    const pricePerNight = priceResult.rows[0].pricepernight;

    // get number of nights
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const numberOfNights = timeDiff / (1000 * 60 * 60 * 24);
    if (numberOfNights <= 0) {
      return res.status(400).json({error: "Invalid date range"});
    }

    // calculate total price
    const totalPrice = pricePerNight * numberOfNights;

    // insert booking
    const result = db.query(
      `INSERT INTO Bookings (propertyID, renterID, startDate, endDate, totalPrice, bookingStatus)
       VALUES ($1, $2, $3, $4, $5, 'Pending') RETURNING *`,
      [propertyID, renterID, startDate, endDate, totalPrice]
    );

    res.json({
      message: "Booking created successfully",
      booking: result.rows[0],
    });

  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({error: "Database error"});
  }
});

// approve a booking
router.put("/:bookingID/approve", (req, res) => {
  const bookingID = req.params.bookingID;

  try {
    const result = db.query(
      `UPDATE Bookings SET bookingStatus = 'Approved' WHERE bookingID = $1 RETURNING *`,
      [bookingID]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({error: "Booking not found"});
    }

    res.json({
      message: "Booking approved successfully",
      booking: result.rows[0],
    });
  } catch (err) {
    console.error("Error approving booking:", err);
    res.status(500).json({error: "Database error"});
  }
});

// deny a booking
router.put("/:bookingID/deny", (req, res) => {
  const bookingID = req.params.bookingID;

  try {
    const result = db.query(
      `UPDATE Bookings SET bookingStatus = 'Denied' WHERE bookingID = $1 RETURNING *`,
      [bookingID]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({error: "Booking not found"});
    }

    res.json({
      message: "Booking denied successfully",
      booking: result.rows[0],
    });
  } catch (err) {
    console.error("Error denying booking:", err);
    res.status(500).json({error: "Database error"});
  }
});

module.exports = router;