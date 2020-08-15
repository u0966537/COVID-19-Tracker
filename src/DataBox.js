import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./styles/DataBox.css";

function DataBox({ title, cases, total, active, isRed, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`dataBox ${active && "dataBox--selected"} ${
        isRed && "dataBox--red"
      }`}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2 className={`dataBox_cases ${!isRed && "dataBox_cases--green"}`}>
          {cases}
        </h2>
        <Typography className="dataBox_total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DataBox;
