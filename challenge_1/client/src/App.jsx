import React, { useState } from "react";
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import { Router, Route } from "react-router";
import history from "./history.js";
import styled from "styled-components";

const App = () => {
  const [page, changePage] = useState(1);
  const pageArray = [...Array(10).keys()];
  return (
    <Router history={history}>
      {/* Map each page to a route */}
      {pageArray.map((page) => {
        return (
          <Route path={`/${page}`}>
            <h1>{`Page #${page}`}</h1>
          </Route>
        );
      })}
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={page}
        marginPagesDisplayed={2}
        pageRangeDisplayed={pageArray.length}
        onPageChange={(data) => {
          debugger;
        }}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
