const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

process.on("SIGTERM ", () => {
  connection.end((err) => {
    if (err) {
      console.error("Error closing MySQL connection:", err);
    } else {
      console.log("MySQL connection closed.");
    }
    process.exit();
  });
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "artholus6*Databa5e",
  database: "express",
  connectTimeout: 6000000,
});

connection.connect((err) => {
  if (err) {
    console.error("Error reconnecting to database:", err);
    setTimeout(handleDisconnect, 2000); // Retry after 2 seconds
  }
});

connection.connect();

connection.query("SELECT * FROM entry", (err, rows, fields) => {
  if (err) {
    throw err;

    return;
  }
  //  console.log("The solution is: ", rows[0].solution);
});

let entries = [];

app.use(cors());
app.use(express.json()); //middleware to convert body to json

app.get("/", (req, res) => {
  res.status(200).send({
    message: " SUCCESS",
  });
});

app.post("/entries", async (req, res) => {
  const { name, username, values } = req.body;
  console.log("name: " + name + " username: " + username);

  try {
    // Step 1: Fetch user_id
    const userQuery = `SELECT username FROM user WHERE username ='${username}'`;
    const userResults = await new Promise((resolve, reject) => {
      connection.query(userQuery, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
    /*
    const user_id = userResults[0]?.id;

    if (!user_id) {
      return res.status(404).send({ error: "User not found" });
    }

    console.log("Fetched User ID:", user_id);*/

    // Step 2: Insert into entry table              ${name}'  ${username}

    const entryQuery = `INSERT INTO entry VALUES ('${uuidv4()}', '${values}', 'a')`;
    await new Promise((resolve, reject) => {
      connection.query(entryQuery, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    console.log("Inserted into entry table");

    res.status(200).send({ message: "Entry and parts added successfully" });
  } catch (error) {
    console.error("Error during database operations:", error);
    res.status(500).send({ error: "Database error occurred" });
  }
});

app.get("/entries", (req, res) => {
  console.log("/////////////////////////////////////////////");
  const query = "SELECT * FROM entry";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Database error");
      entries = results;
      return;
    }
    entries = results;
    console.log("entries: ", entries);
  });

  res.json(entries);
  res.status(200).send({ data: entries });
});

app.post("/sign_in", (req, res) => {
  const { username, password } = req.body;
  //console.log("USERNAME: ", username, " PASSWORD: ", password);
  const query = `SELECT * FROM user WHERE username= '${username}' AND password='${password}' `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Database error");
      return;
    }
    const rowCount = results.length;

    res.status(200).send({ rowCount, data: results });
  });
});

app.post("/matching_user", (req, res) => {
  const { id } = req.body;

  // const query = `  SELECT * FROM entry JOIN user ON user.id = entry.User_id  WHERE entry.id = ${id};`;

  const query = `  SELECT user.name FROM entry JOIN user ON user.id = entry.User_id  WHERE entry.id = ${id};`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Database error");
      return;
    }
    entries = results;
    const username = results.length > 0 ? results[0].name : null;
    //console.log("MATCHING RESULT: ", username);

    res.status(200).send({ username });
  });
});

app.listen(PORT, () => console.log("Listening..."));

//connection.end();
