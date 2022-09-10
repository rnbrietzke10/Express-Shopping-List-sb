const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressErrors');
const items = require('../fakeDB');

router.get('/', function (req, res) {
  res.json({ items });
});

router.get('/:name', function (req, res) {
  const foundItem = items.find(item => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError('Item not found', 404);
  }
  return res.json({ item: foundItem });
});

router.post('/', function (req, res, next) {
  try {
    if (!req.body.name || !req.body.price)
      throw new ExpressError('Item must have a name', 400);
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.status(201).json({ item: newItem });
  } catch (e) {
    return next(e);
  }
});

router.patch('/:name', function (req, res) {
  const foundItem = items.find(item => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError('Item not found', 404);
  }

  if (req.body.name) {
    foundItem.name = req.body.name;
  }
  if (req.body.price) foundItem.price = req.body.price;
  res.json({ updated: foundItem });
});

router.delete('/:name', function (req, res, next) {
  const foundItem = items.findIndex(item => item.name === req.params.name);
  console.log(foundItem);
  try {
    if (foundItem === -1) {
      throw new ExpressError('Item not found', 404);
    }
    items.splice(foundItem, 1);
    return res.json({ message: 'Deleted' });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
