import React, { useEffect, useState } from "react";
import axios from "axios";

const getParts = () => {
  return;
};

const getUsername = async (id) => {
  console.log("GET USERNAME ID_ ", id);
  if (id != null && id != undefined) {
    const response = await axios.post("http://localhost:5000/matching_user", {
      id: id,
    });
    console.log("USERNAME FINAL: ", response.data.username);
    return response.data.username;
  } else {
    console.log("UNDEFINED");
    return "undefined";
  }

  // return "a";
};

const Entry = ({ entryID, name, image, values, onDelete, onUpdate }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const fetchedUsername = await getUsername(entryID);
      setUsername(fetchedUsername);
    };
    fetchUsername();
  }, [entryID]);

  return (
    <div>
      <div>
        <p>name: {name}</p>
        <p>username:{username} </p>
        <p></p>
        <strong>parts:</strong>

        <button onClick={() => onDelete(entryID, username)}>DELETE</button>
        <br />
        <br />
        <button onClick={() => onUpdate(entryID, username)}>UPDATE</button>
      </div>
    </div>
  );
};

export default Entry;
