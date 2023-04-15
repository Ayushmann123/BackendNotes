const express = require("express");
const router = express.Router();
var fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

//ROUTE 1 GET ALL NOTES , LOGGED IN REQUIRED

router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("some Error Occured");
  }
});

//ROUTE 2 Add A NEW NOTE, LOGGED IN REQUIRED

router.post(
  "/addNote",
  fetchUser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast five characters").isLength(
      { min: 5 }
    ),
    // body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      //If there are errors return bad request and error
      const { title, description, tag } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newNote = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await newNote.save();

      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some Error Occured");
    }
  }
);

// ROUTE 3: UPDATE AN EXISTING NOTE

router.put(
  "/updateNote/:id",
  fetchUser,

  async (req, res) => {
    const { title, description, tag } = req.body;

    //create a newNote object
  try{
    const updatedNote = {};
    if (title) {
      updatedNote.title = title;
    }
    if (description) {
      updatedNote.description = description;
    }
    if (tag) {
      updatedNote.tag = tag;
    }

    // find the note to be updated and update it

    let note = await Notes.findById(req.params.id);

    if (!note) {
      res.status(404).send("Not found");
    }

    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: updatedNote },
      { updated: true }
    );
    res.json({ note });
  }catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
    
  }
);

//ROUTE 4: Delete an existing note , login required

router.delete(
  "/deleteNote/:id",
  fetchUser,



  async (req, res) => {

    try{
         // find the note to be deleted and deleted it

    let note = await Notes.findById(req.params.id);

    if (!note) {
      res.status(404).send("Not found");
    }

    // ALOW DELETION ONLY IF USER OWNS THIS NOTE IE. WAHI USER HAI JO AUTHENTICATED HAI, TOKEN DATA CHECK KARNA

    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "note has been deleted", notesss: note });
    }catch (error) {
        console.log(error.message);
        res.status(500).send("some Error Occured");
      }
   
  }
);

module.exports = router;
