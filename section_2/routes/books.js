const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json")


// router.post("/", function (req, res, next) {
//   const bookData = req.body.book;

//   if (!bookData) {
//     // pass a 400 error to the error-handler
//     let error = new ExpressError("Book data is required", 400);
//     return next(error);
//   }

//   // (not implemented) insert book into database here

//   return res.json(bookData);
// });

router.post('/', async (req, res, next) => {
  // just like we practiced with the node console we have two arguments, the data and the schema
  const result = jsonschema.validate(req.body, bookSchema);
  // the result we get back is an object , look below for an example fo the type of object we get back and what it contains 
  if (!result.valid) {
    // the most useful thing to us is the errors stack so we want to map that to a new array and send that back as our message in a new Express Error 

    const listOfErrors = result.errors.map(e => e.stack)
    const err = new ExpressError(listOfErrors, 400);

    return next(err)
  }

  return res.json("That is valid!!")
})

// > jsonschema.validate("hello",{"type":"string"})
// ValidatorResult {
//   instance: 'hello',
//   schema: { type: 'string' },
//   options: {},
//   path: [],
//   propertyPath: 'instance',
//   errors: [],
//   throwError: undefined,
//   throwFirst: undefined,
//   throwAll: undefined,
//   disableFormat: false
// }

module.exports = router;
