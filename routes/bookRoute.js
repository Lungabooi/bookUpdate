const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");

router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM books", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});


router.get("/:id", (req, res) => {
    try {
        con.query(`SELECT * FROM books WHERE book_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });


router.delete("/:id", (req, res) => {
    if (req.user_type == "admin"){
    try {
        con.query(`DELETE  FROM books WHERE book_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
} else {
    res.alert("Access Denied Not Admin")
};
  });

  router.put("/:id", (req, res) => {
    const {
      book_id,
      title,
      author,
      publisher,
      category,
      quantity,
      user_id,
      price,
      imgURL,
    } = req.body;
    try {
        con.query(`UPDATE books SET book_id='${book_id}', title='${title}', author ='${author}', publisher='${publisher}', category='${category}', quantity='${quantity}', user_id='${user_id}' , price='${price}', imgURL='${imgURL}'  WHERE user_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });

  router.post("/", (req, res) => {
    const book = {
      title:req.body.title,
      author:req.body.author,
      publisher:req.body.publisher,
      category:req.body.category,
      quantity:req.body.quantity,
      price:req.body.price,
      imgURL:req.body.imgURL,
    } 
    try {
        con.query(`INSERT INTO books SET ?`,book, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });



module.exports = router;