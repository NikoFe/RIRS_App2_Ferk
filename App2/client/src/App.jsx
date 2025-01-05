import React, { useEffect, useState } from "react";
import axios from "axios";
import Entry from "./components/Entry";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const API_URL = "http://localhost:5000/entries";
  const [creating, setCreating] = useState(false);
  const [rows, setRows] = useState([{ part: "", price: "", key: uuidv4() }]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("Default");
  const [entries, setEntries] = useState([]);
  const [password, setPassword] = useState("");
  const [signed, setSigned] = useState(false);

  const updateEntry = (id, usernameParam) => {
    return;
  };
  const deleteEntry = (id, usernameParam) => {
    return;
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const pushEntries = async (entry) => {
    console.log("2");
    setLoading(true);
    console.log("PUSH ENTRIES: ", entries);
    try {
      //  string_values = entry.values.toString();

      const response = await axios.post(API_URL, {
        name: entry.name,
        username: entry.username,
        values: "string_values",
      });
      //setEntries((entries) => [...entries, response.data]);
      console.log("VVVVVVVVVVVVVVVVVVV: ", response);
      const data = response.data;
      setEntries(data);
      // console.log("ENTRIES: ", entries);
    } catch (error) {
      console.error("Error pushing entries", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    console.log("FETCH ENTRIES: ", entries);
    try {
      const response = await axios.get(API_URL);
      console.log("AAAAA: ", response.data);
      const data = Array.isArray(response.data) ? response.data : [];
      setEntries(data);
      console.log("ENTRIES: ", response.data);
    } catch (error) {
      console.error("Error fetching entries", error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  const createNewEntry = (name, username, values) => {
    console.log("1");
    const newEntry = {
      name: name,
      values: values,
      // entryID: Math.random() * 1000,
      username: username,
      // onDelete: deleteEntry,
    };

    setEntries((prevEntries) => [...prevEntries, newEntry]);

    console.log(entries);
    // Then, push the new entry to the backend
    pushEntries(newEntry);

    /*
    setEntries((prevEntries) => {
      console.log("3");
      const updatedEntries = [...prevEntries, newEntry]; // Create the updated array
      pushEntries(newEntry); // Push only the new entry to the backend
      return updatedEntries; // Update the state with the new array
    });*/
  };

  const handleSubmit = () => {
    const isValid = rows.every((row) => row.part && row.price);
    if (!isValid) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    const values = rows.map((row) => ({
      part: row.part,
      price: row.price,
      key: uuidv4(),
    }));

    createNewEntry("placeholder_name", username, values);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const validate_sign_in = async (usr, pss) => {
    try {
      console.log("VALIDATE :" + "USERNAME: " + usr + " PASSWORD: " + pss);
      const response = await axios.post("http://localhost:5000/sign_in", {
        username: usr,
        password: pss,
      });

      //setEntries((entries) => [...entries, response.data]);

      if (response.data.rowCount == 1) {
        return true;
      } else {
        return false;
      }
      // console.log("ENTRIES: ", entries);
    } catch (error) {
      console.error("Error fetching entries", error);
    }
  };

  const validate = async () => {
    if (username != "" && password != "") {
      console.log("USERNAME: " + username + " PASSWORD: " + password);

      const valid = await validate_sign_in(username, password);
      //console.log("VALID? : ", valid);
      if (valid) {
        setSigned(true);
      }
    }
    return;
  };

  return (
    <div className="main_div">
      {!signed && (
        <div className="signin_div">
          <input
            type="text"
            placeholder="user1 "
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="pass1"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button onClick={validate}>log in </button>
        </div>
      )}
      {signed && (
        <div className="signed">
          {creating && (
            <div className="creating_div">
              <div className="rows">
                {rows.map((row, index) => (
                  <div className="row" key={row}>
                    <input
                      type="text"
                      placeholder="Computer Part"
                      //value={part}
                      onChange={(e) =>
                        handleChange(index, "part", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      //value={price}
                      onChange={(e) =>
                        handleChange(index, "price", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              <button onClick={() => handleSubmit()}>CREATE</button>
            </div>
          )}

          <button onClick={() => setCreating(true)}>Add</button>
          <button
            onClick={() => {
              console.log(rows);
            }}
          >
            DEBUG
          </button>

          {entries.length <= 0 && "No Entries"}
          {entries.length > 0 &&
            !loading &&
            entries.map((entry) => {
              return (
                <Entry
                  entryID={entry.id}
                  name={entry.name}
                  //image={"image"}
                  values={entry.values}
                  // onDelete={onDelete}
                  //onUpdate={onUpdate}
                ></Entry>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default App;
