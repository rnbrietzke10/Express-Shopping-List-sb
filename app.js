const express = require('express');
const app = express();
const ExpressError = require('./expressErrors');
const itemsRoutes = require('./routes/store');

app.use(express.json());
app.use('/items', itemsRoutes);

/* Not found error handler */
app.use(function (req, res, next) {
  return new ExpressError('Not Found', 404);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

module.exports = app;
