// import React from "react";
import { useState } from "react";

function Dropdown({ selectedOption, handleDropDownChange }) {
//   const [selectedOption, setSelectedOption] = useState('');

//   const handleDropDownChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

  return (
    <div style={{ padding: '10px' }}>
      <label htmlFor="dropdown">Role: </label>
      <select id="dropdown" value={selectedOption} onChange={handleDropDownChange}>
        <option value="">-- Endpoint --</option>
        <option value="ev">EV</option> 
        <option value="chat">Chat</option>
        <option value="chatbot">Chatbot</option>
        <option value="planner">Planner</option>
        <option value="detector">CompleteSentenceDetector</option>
        {/* <option value="octopusV2">OctopusV2</option> */}
      </select>

      {/* {selectedOption && (
        <p style={{ marginTop: '10px' }}>
          You selected: <strong>{selectedOption}</strong>
        </p>
      )} */}
    </div>
  );
}

export default Dropdown;
