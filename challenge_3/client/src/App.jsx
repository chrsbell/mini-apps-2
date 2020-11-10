import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const App = () => {
  // the current bowling round
  let [round, setRound] = useState(1);

  const submit = (e) => {
    console.log("submitted");
  };

  return (
    <>
      <h1>Bowling App</h1>
      <table>
        <tr>
          <th></th>
          {[...Array(10).keys()].map((index) => {
            return <th>{index + 1}</th>;
          })}
        </tr>
        <tr>
          <td>Name</td>
          {[...Array(10).keys()].map((index) => {
            return <td> </td>;
          })}
        </tr>
      </table>
      <h2>Select the number of pins hit</h2>
      <form onSubmit={submit}>
        <select name="pin-count">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
