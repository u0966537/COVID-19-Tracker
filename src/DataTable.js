import React from "react";
import "./styles/DataTable.css";
import numeral from "numeral";

function DataTable({ countries }) {
  return (
    <div className="dataTable">
      {countries.map((country) => (
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>{numeral(country.cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default DataTable;
