const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Event = require('../models/Event');

module.exports = Router()
  .post('/', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })

  .get('/', (req, res) => {
    let query = {};
    if(req.query.ingredient) {
      query = { 'ingredients.name': req.query.ingredient };
    }
    Recipe
      .find(query)
      .select({ name: true })
      .then(recipes => res.send(recipes));
  })

  .get('/:id', (req, res) => {
    Promise.all([
      Recipe.findById(req.params.id),
      Event.find({ recipe: req.params.id })
    ])
      .then(([Recipe, Event]) => {
        res.send({ ...Recipe.toJSON(), Event });
      });
  
  })

  .patch('/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })

  .delete('/:id', (req, res) => {
    Promise.all([
      Recipe.findByIdAndDelete(req.params.id),
      Event.deleteMany({ recipeId: req.params.id })
    ])
      .then(([recipe]) => res.send({ ...recipe.toJSON() }));
  });
