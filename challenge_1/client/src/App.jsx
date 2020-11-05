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
  InfiniteScroll,
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
  const [query, setQuery] = useState("");

  // set react router page once on component mount and get initial list of events
  useEffect(() => {
    changePage(1);
    history.push("/page/1");
  }, []);

  const getEvents = (query) => {
    // get token to cancel axios call
    let source = axios.CancelToken.source();
    // only get 10 at a time
    let endpoint = `/api/events?_page=${page}&_limit=10`;
    if (query.length) {
      endpoint = `${endpoint}&q=${query}`;
    }
    axios
      .get(endpoint, {
        cancelToken: source.token,
      })
      .then((res) => {
        setEventList([]);
        setEventList(res.data);
      });
    return () =>
      source.cancel("Cancelled axios request during component unmount.");
  };

  // reset page on query change
  useEffect(() => {
    history.push("/page/1");
    return getEvents(query);
  }, [query]);

  // get next list of results on page change
  useEffect(() => {
    history.push(`/page/${page}`);
    return getEvents(query);
  }, [page]);

  // update the query
  const updateSearchField = (e) => {
    setQuery(e.target.value);
  };

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
            onChange={updateSearchField}
            onSelect={null}
            suggestions={null}
            placeholder="Search..."
          />
        </Box>
        <Router history={history}>
          {/* Map each page to a route */}
          {pageArray.map((page) => {
            return (
              <Route path={`/page/${page + 1}`}>
                <Box size="xlarge">
                  <DataTable
                    columns={columns.map((column) => ({
                      ...column,
                      search: column.property === "date",
                    }))}
                    data={eventList}
                  />
                </Box>
              </Route>
            );
          })}
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={numPages}
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
