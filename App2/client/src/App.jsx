import React, { useEffect, useState } from "react";
import axios from "axios";
import Entry from "./components/Entry";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const API_URL = "http://localhost:5000/entries";
  const [creating, setCreating] = useState(false);
  const [rows, setRows] = useState([
    { part: "", price: "", key: uuidv4() },
    { part: "", price: "", key: uuidv4() },
    { part: "", price: "", key: uuidv4() },
  ]);
  const [username, setUserName] = useState("Default");
  const [entries, setEntries] = useState([]);

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
    // setLoading(true);
    console.log("PUSH ENTRIES: ", entries);
    try {
      string_values = entry.values.toString();

      const response = await axios.post(API_URL, {
        name: entry.name,
        username: entry.username,
        values: string_values,
      });
      //setEntries((entries) => [...entries, response.data]);
      console.log("VVVVVVVVVVVVVVVVVVV: ", response);
      const data = response.data;
      setEntries(data);
      // console.log("ENTRIES: ", entries);
    } catch (error) {
      console.error("Error pushing entries", error);
    } finally {
      //setLoading(false);
    }
  };

  const fetchEntries = async () => {
    //  setLoading(true);
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
      //  setLoading(false); // End loading state
    }
  };

  const createNewEntry = (name, username, values) => {
    const newEntry = {
      name: name,
      values: values,
      // entryID: Math.random() * 1000,
      username: username,
      // onDelete: deleteEntry,
    };

    setEntries((prevEntries) => {
      const updatedEntries = [...prevEntries, newEntry]; // Create the updated array
      pushEntries(newEntry); // Push only the new entry to the backend
      return updatedEntries; // Update the state with the new array
    });
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

  return (
    <div className="main_div">
      {creating && (
        <div className="creating_div">
          <div className="rows">
            {rows.map((row, index) => (
              <div className="row" key={row}>
                <input
                  type="text"
                  placeholder="Computer Part"
                  //value={part}
                  onChange={(e) => handleChange(index, "part", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  //value={price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
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
  );
};

export default App;
