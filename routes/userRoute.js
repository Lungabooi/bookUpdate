const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const middleware = require("../middleware/auth")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//get all users
router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM users", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});

//Add to users
router.post("/", (req, res) => {
  const user = {
    full_name:req.body.full_name,
    email:req.body.email,
    phone_number:req.body.phone_number,
    password:req.body.password,
    join_date:req.body.join_date,
    user_type:req.body.user_type,
  } 
  try {
      con.query(`INSERT INTO users SET ?`,user, (err, result) => {
          if (err) throw err;
          res.send(result);
      });
  } catch (error) {
      console.log(error);
      res.status(400).send(error)
  }
});


//Getting a single user by Id from Users table.

router.get("/:id", (req, res) => {
    try {
        con.query(`SELECT * FROM users WHERE user_id ="${req.params.id}"`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });

  //update user by id
router.put("/:id", (req, res) => {
    const {
      full_name,
      email,
      password,
      phone_number,
      join_date,
      user_type,
    } = req.body;
    try {
        con.query(`UPDATE users SET full_name='${full_name}', email='${email}', password ='${password}', phone_number='${phone_number}', join_date='${join_date}', user_type='${user_type}'   WHERE user_id ="${req.params.id}"`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });


  // Delete a single user from the database
router.delete("/:id", (req, res) => {
    try {
        con.query(`DELETE  FROM users WHERE user_Id ="${req.params.id}"`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });
  


  // Register Route
// The Route where Encryption starts
router.post("/register", (req, res) => {
    try {
      let sql = "INSERT INTO users SET ?";
  
      // This is the body in requesting
      const {
        full_name,
        email,
        password,
        phone_number,
        join_date,
        user_type,
        cart,
      } = req.body;
  
      // The start of hashing / encryption
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
  
      let user = {
        full_name,
        email,
        // We sending the hash value to be stored within the table
        password:hash,
        phone_number,
        join_date,
        user_type,
        cart,
      };
  
      // connection to the database 
      con.query(sql, user, (err, result) => {
        if (err) throw err;
        console.log(result);
        // res.send(`User ${user.full_name,user.email} created successfully`);
        res.send(user)
      });
    } catch (error) {
      console.log(error);
    }
  });
  
  // Login
  router.post("/login", (req, res) => {
    try {
      let sql = "SELECT * FROM users WHERE ?";
      let user = {
        email: req.body.email,
      };
      con.query(sql, user, async (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          res.send("Email not found please register");
        } else {
          const isMatch = await bcrypt.compare(
            req.body.password,
            result[0].password
          );
          if (!isMatch) {
            res.send("Password incorrect");
          } else {
            // The information the should be stored inside token
            
            const  user ={
                user_Id: result[0].user_Id,
                email: result[0].email,
                full_name: result[0].full_name,
                password: result[0].password,
                phone_number: result[0].phone_number,
                join_date: result[0].join_date,
                cart: result[0].cart,
                product_Id: result[0].product_Id,
                user_type: result[0].user_type,
              }
            // Creating a token and setting expiry date
            jwt.sign(
            user,
              process.env.jwtSecret,
              {
                expiresIn: "365d",
              },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  
  router.get("/users/verify", (req, res) => {
      const token = req.header("x-auth-token");
      jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
        if (error) {
          res.status(401).json({
            msg: "Unauthorized Access!",
          });
        } else {
          res.status(200);
          res.send(decodedToken);
        }
      });
    });
    router.get("/", middleware, (req, res) => {
      try {
        let sql = "SELECT * FROM users";
        con.query(sql, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      } catch (error) {
        console.log(error);
      }
    });
  
  
  
  
  
  
  
  
  
  

  

module.exports = router;