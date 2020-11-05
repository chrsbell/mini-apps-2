import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import { Router, Route } from "react-router";
import history from "./history.js";
import styled from "styled-components";
import axios from "axios";
import { Search } from "grommet-icons";
import {
  Box,
  Image,
  Grommet,
  Text,
  TextInput,
  Heading,
  DataTable,
} from "grommet";
import { grommet, ThemeType } from "grommet/themes";
import _ from "underscore";

const columns = [
  {
    property: "date",
    header: <Text>Date</Text>,
    render: (datum) =>
      datum.date && new Date(datum.date).toLocaleDateString("en-US"),
    primary: true,
    align: "end",
  },
  {
    property: "category1",
    header: "category1",
  },
  {
    property: "category2",
    header: "category2",
  },
  {
    property: "description",
    header: "description",
    align: "end",
  },
];

const App = () => {
  const [page, changePage] = useState(1);
  const [eventList, setEventList] = useState([]);
  const [activeIndex, setActiveIndex] = useState([0]);
  debugger;
  // set react router page once on component mount
  useEffect(() => {
    const endpoint = window.location.pathname;
    if (endpoint !== "/") {
      let pageIndex = Number(endpoint.replace(/\//g, "").slice(-1));
      pageIndex = pageIndex <= 0 || pageIndex === undefined ? 1 : pageIndex;
      changePage(pageIndex);
      history.push(`/page/${pageIndex}`);
    } else {
      changePage(1);
      history.push(`/page/1`);
    }
  }, []);

  // get event data from JSON server on page change, cancel async request on component unmount
  useEffect(() => {
    let source = axios.CancelToken.source();
    history.push(`/page/${page}`);
    axios
      .get(`/api/events?page=${page}&_limit=100`, {
        cancelToken: source.token,
      })
      .then((res) => {
        // chunk into sub arrays of length 10
        setEventList(_.chunk(res.data, 10));
      });
    return () => {
      source.cancel("Cancelled axios request during component unmount.");
    };
  }, [page]);

  const numPages = 10;
  // add extra page to account for page #0
  const pageArray = [...Array(numPages + 1).keys()];
  return (
    <Grommet theme={grommet} full>
      <Box background="dark-1" fill align="center" pad={{ top: "large" }}>
        <Box
          direction="row"
          width="large"
          align="center"
          pad={{ horizontal: "small", vertical: "xsmall" }}
          round="small"
          pad={{ horizontal: "small", vertical: "xsmall" }}
          round="small"
          border={{
            side: "all",
            color: "border",
          }}
        >
          <Search color="brand" />
          <TextInput
            type="search"
            // dropTarget={boxRef.current}
            plain
            value={null}
            onChange={null}
            onSelect={null}
            suggestions={null}
            placeholder="Search..."
          />
        </Box>
        <Router history={history}>
          {/* Map each page to a route */}
          {pageArray.map((page) => {
            return (
              <Route path={`/page/${page}`}>
                <Heading>{`Page #${page}`}</Heading>
                <DataTable
                  columns={columns.map((column) => ({
                    ...column,
                    search: column.property === "date",
                  }))}
                  data={eventList[page]}
                  sortable
                />
              </Route>
            );
          })}
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={eventList.length - 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(data) => {
              changePage(data.selected + 1);
            }}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </Router>
      </Box>
    </Grommet>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
