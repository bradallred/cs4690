var fs = require('fs');
var router = require('express').Router();

// make the entries directory if it doesnt exist
// do this synchonously so it is ready before accepting requests
var path = require('path');
var appDir = path.dirname(require.main.filename);
var ENTRIES = appDir + '/web/entries/';

if (!fs.existsSync(ENTRIES)) {
  fs.mkdirSync(ENTRIES);
}

//REST API V1 calls go here.
router.get('/entries.json', function(req, res) {
  fs.readdir(ENTRIES, function(err, items) {
    if (err) {
      res.json([]);
    } else {
      res.json(items);
    }
  });
});

// IDEMPOTENT - You can repeat the operation as many times as you want without changing state.
// Create
router.post('/entries.json', function(req, res) {
  var file = ENTRIES + req.params.file;
  fs.exists(file, function(exists) {
    if (exists) {
      res.status(500).send("File " + file + " already exists.");
    } else {
      fs.writeFile(file, req.body, function(err) {
        res.status(201).send("Created " + file);
        console.log("Created " + file);
      });
    }
  });
});

// Read
router.get('/entries/:id', function(req, res) {
  var file = ENTRIES + req.params.id;
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.status(404).next();
  }
});

// Update
router.put('/entries/:id', function(req, res) {
  var file = ENTRIES + req.params.id;
  fs.appendFile(file, req.body, function(err) {
    if (err) {
      res.status(500).send("Unable to update " + file);
    } else {
      res.status(204).send("Appended to " + file);
      console.log("Appended to " + file);
    }
  });
});

// Delete
router.delete('/entries/:id', function(req, res) {
  var file = ENTRIES + req.params.id;
  fs.unlink(file, function(err) {
    if (err) {
      res.status(500).send("Unable to delete " + file);
    } else {
      res.status(204).send("Deleted " + file);
      console.log("Deleted " + file);
    }
  });
});

module.exports = router;
// END API V1 METHODS
