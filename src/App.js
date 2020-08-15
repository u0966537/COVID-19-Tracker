import React, { useState, useEffect } from "react";
import numeral from "numeral";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";

// other js file imports
import DataBox from "./DataBox";
import DataTable from "./DataTable";
import CaseGraph from "./CaseGraph";
import DataMap from "./DataMap";
import { sortData, prettyPrintStat } from "./utils";

// css imports
import "./styles/App.css";
import "leaflet/dist/leaflet.css";

// db import
import db from "./Firebase";

const App = () => {
  const [country, setCountry] = useState("worldwide");
  const [countries, setCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});

  // table values
  const [tableData, setTableData] = useState([]);

  // map values
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState([40, -70]);
  const [mapZoom] = useState(3);

  const [casesType, setCasesType] = useState("cases");
  const [user] = useState("user");

  useEffect(() => {
    document.title = "COVID-19 Tracker"
 }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const table = db.collection("users").doc("count");
    table.get().then(function (doc) {
      if (doc.exists) {
        table.set({
          user_count: Number(doc.data().user_count) + 1,
        });
      }
    });
  }, [user]);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortData(data));
        });
    };
    getCountriesData();
  }, []);

  const onSelectCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        } else {
          setMapCenter([40, -70]);
        }
      });
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onSelectCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <DataBox
            onClick={(e) => setCasesType("cases")}
            title="Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <DataBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <DataBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <DataMap
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <div className="app_information">
            <h3>Live Cases by Country</h3>
            <DataTable countries={tableData} />
            <h3>
              {country} new {casesType}
            </h3>
            <CaseGraph countryCode={country} casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
