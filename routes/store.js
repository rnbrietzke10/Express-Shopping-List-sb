const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressErrors');
const items = require('../fakeDB');

router.get('/', function (req, res) {
  res.json({ items });
});

router.get('/:name', function (req, res) {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError('Item not found', 404);
  }
  return res.json({ item: foundItem });
});

router.post('/', function (req, res) {
  const newItem = { name: req.body.name, price: req.body.price };
  items.push(newItem);
  res.status(201).json({ item: newItem });
});

router.patch('/:name', function (req, res) {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError('Item not found', 404);
  }

  if (req.body.name) {
    foundItem.name = req.body.name;
  }
  if (req.body.price) foundItem.price = req.body.price;
  res.json({ updated: foundItem });
});

router.delete('/:name', function (req, res) {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (foundItem === -1) {
    throw new ExpressError('Item not found', 404);
  }
  items.splice(foundItem, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
