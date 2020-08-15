import React, { useEffect } from "react";
import Pie from "./Pie";
import "./styles.css";

export default function App() {
  useEffect(() => {});

  let data = [5, 12, 8, 3, 10],
    subTitle1 = "Money Spent",
    subTitle2 = "0",
    currency = "\u20B9",
    showLabel = false,
    colors = ["#43A19E", "#7B43A1", "#F2317A", "#FF9824", "#58CF6C"];

  return (
    <div className="App">
      <h1>Hello Mohaan</h1>
      <div>
        <Pie
          data={data}
          subTitle1={subTitle1}
          subTitle2={subTitle2}
          radius={80}
          hole={65}
          colors={colors}
          stroke={1}
          strokeWidth={10}
          showLabel={showLabel}
          currency={currency}
        />
      </div>
    </div>
  );
}
