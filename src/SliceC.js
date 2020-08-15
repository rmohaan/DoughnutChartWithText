import React, { useEffect, useState, useCallback } from "react";
import SubTitle from "./SubTitle";

function getAnglePoint(startAngle, endAngle, radius, x, y) {
  var x1, y1, x2, y2;

  x1 = x + radius * Math.cos((Math.PI * startAngle) / 180);
  y1 = y + radius * Math.sin((Math.PI * startAngle) / 180);
  x2 = x + radius * Math.cos((Math.PI * endAngle) / 180);
  y2 = y + radius * Math.sin((Math.PI * endAngle) / 180);

  return { x1, y1, x2, y2 };
}

// This work is in progress,
// useEffect is triggering the path changes repeatedly
// causing the path drawn to be either null or prev path.
const SliceC = ({
  fill,
  stroke,
  strokeWidth,
  showLabel,
  percent,
  percentValue,
  value,
  ...props
}) => {
  const [path, setPath] = useState("");
  const [pathAry, setPathArr] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isMounted, setMounted] = useState(false);

  const draw = useCallback(
    (s) => {
      if (isMounted) {
        return;
      }

      var p = props,
        pathArr = [],
        a,
        b,
        c,
        step;

      step = p.angle / (37.5 / 2);

      if (s + step > p.angle) {
        s = p.angle;
      }

      // Get angle points
      a = getAnglePoint(
        p.startAngle,
        p.startAngle + s,
        p.radius,
        p.radius,
        p.radius
      );
      b = getAnglePoint(
        p.startAngle,
        p.startAngle + s,
        p.radius - p.hole,
        p.radius,
        p.radius
      );

      pathArr.push("M" + a.x1 + "," + a.y1);
      pathArr.push(
        "A" +
          p.radius +
          "," +
          p.radius +
          " 0 " +
          (s > 180 ? 1 : 0) +
          ",1 " +
          a.x2 +
          "," +
          a.y2
      );
      pathArr.push("L" + b.x2 + "," + b.y2);
      pathArr.push(
        "A" +
          (p.radius - p.hole) +
          "," +
          (p.radius - p.hole) +
          " 0 " +
          (s > 180 ? 1 : 0) +
          ",0 " +
          b.x1 +
          "," +
          b.y1
      );

      // Close
      pathArr.push("Z");

      setPathArr(pathArr.join(" "));

      if (s < p.angle) {
        setTimeout(function () {
          draw(s + step);
        }, 16);
      } else if (p.showLabel) {
        c = getAnglePoint(
          p.startAngle,
          p.startAngle + p.angle / 2,
          p.radius / 2 + p.trueHole / 2,
          p.radius,
          p.radius
        );

        setX(c.x2);
        setY(c.y2);
      }
    },
    [props, isMounted]
  );

  const animate = useCallback(() => {
    draw(0);
  }, [draw]);

  useEffect(() => {
    setMounted(true);
    animate();
    return () => {
      setMounted(false);
    };
  }, [animate]);

  useEffect(() => {
    // console.log("hit", path);
    setPath("");
    console.log("empty path");
  }, [props.radius, props.hole]);

  useEffect(() => {
    console.log("hit", path, pathAry);
    animate();
    setPath(pathAry);
  }, [path, animate]);

  // console.log( "path", path, "\n", pathAry);
  return (
    <g overflow="hidden">
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth ? strokeWidth : 3}
      />
      {showLabel && percentValue > 5 ? (
        <text x={x} y={y} fill="#fff" textAnchor="middle">
          {percent ? percentValue + "%" : value}
        </text>
      ) : null}
      {props.subTitle1 ? (
        <SubTitle {...props} textAnchor="middle" fill="#aaa" />
      ) : null}
    </g>
  );
};

export default SliceC;
