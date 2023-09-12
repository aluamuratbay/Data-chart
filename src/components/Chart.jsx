import React, { useState, useEffect } from 'react';
import axios from "axios";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const URL = "http://188.94.158.122:8080/transporttelemetry/get/coordsOverTime";

export default function Chart({ timeStampBegin, timeStampEnd }) {
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    axios(URL, {
      params: {
        rigId: 36,
        timeStampBegin: timeStampBegin,
        timeStampEnd: timeStampEnd,
      }
    })
      .then(response => {
        const data = response.data.map((item) => ({
          date: item.timeStart,
          fuelLevel: item.fuelLevel,
          fuelLevel2: item.fuelLevel2,
          totalFuelLevel: item.fuelLevel + item.fuelLevel2,
          speed: item.speed,
        }))
        setStatsData(data);
      })
      .catch(err => console.log(err));
  }, [timeStampBegin, timeStampEnd]);

  useEffect(() => {
    const root = am5.Root.new("chartdiv");
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    const chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    }));

    // cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);

    // axes
    const xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: "minute", count: 1 },
      min: timeStampBegin,
      max: timeStampEnd,
      markUnitChange: false,
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 90,
      }),
      tooltip: am5.Tooltip.new(root, {}),
    }));

    xAxis.get("dateFormats")["day"] = "dd.MM hh:mm";
    xAxis.get("dateFormats")["hour"] = "dd.MM hh:mm";
    xAxis.get("dateFormats")["minute"] = "dd.MM hh:mm";

    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan:"zoom"
      })  
    }));
    
    // series
    const series = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Total Fuel Level",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "totalFuelLevel",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      }),
    }));
    series.set("stroke", am5.color(0x3f4ac7));
    series.fills.template.setAll({
      fillOpacity: 0.2,
      visible: true
    });
    series.set("fill", am5.color(0x3f4ac7));
  

    const series2 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Fuel Level",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "fuelLevel",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      }),
    }));
    series2.set("stroke", am5.color(0x9b3232));
    series2.fills.template.setAll({
      fillOpacity: 0.2,
      visible: true
    });
    series2.set("fill", am5.color(0x9b3232));
  
    const series3 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Fuel Level 2",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "fuelLevel2",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      }),
    }));
    series3.set("stroke", am5.color(0x56c73f));
    series3.fills.template.setAll({
      fillOpacity: 0.2,
      visible: true
    });
    series3.set("fill", am5.color(0x56c73f));
    
    const series4 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Speed",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "speed",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      }),
    }));
    series4.set("stroke", am5.color(0x870785));
    series4.fills.template.setAll({
      fillOpacity: 0.2,
      visible: true
    });
    series4.set("fill", am5.color(0x870785));
  
 
    // scrollbar
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

    // legend
    const legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, {
      width: 200,
      paddingLeft: 15,
      height: am5.percent(100),
    }));

    legend.itemContainers.template.set("width", am5.p100);    
    legend.valueLabels.template.setAll({
      width: am5.p100,
      textAlign: "right",
    });

    legend.data.setAll(chart.series.values);
    
    series.data.setAll(statsData);
    series2.data.setAll(statsData);
    series3.data.setAll(statsData);
    series4.data.setAll(statsData);

    // Range Slides
    const rangeDate = new Date(timeStampBegin + ((timeStampEnd - timeStampBegin) / 2));
    const seriesRangeDataItem = xAxis.makeDataItem({});
    const seriesRange = series.createAxisRange(seriesRangeDataItem);
    
    seriesRange.fills.template.setAll({
      visible: true,
      opacity: 0.3
    });
    seriesRange.fills.template.set("fillPattern", am5.LinePattern.new(root, {
      color: am5.color(0x3f4ac7),
      rotation: 45,
      strokeWidth: 2,
      width: 2000,
      height: 2000,
      fill:am5.color(0xffffff)
    }));
    seriesRange.strokes.template.set("stroke", am5.color(0x3f4ac7));
   
    xAxis.onPrivate("max", function (value) {
      seriesRangeDataItem.set("endValue", value);
      seriesRangeDataItem.set("value", rangeDate.getTime());
    });

    // add axis range
    const range = xAxis.createAxisRange(xAxis.makeDataItem({}));
    const color = root.interfaceColors.get("primaryButton");
    range.set("value", rangeDate.getTime());
    range.get("grid").setAll({
      strokeOpacity: 1,
      stroke: color
    });
    const resizeButton = am5.Button.new(root, {
      themeTags: ["resize", "horizontal"],
      icon: am5.Graphics.new(root, {
        themeTags: ["icon"]
      })
    });

    // restrict from being dragged vertically
    resizeButton.adapters.add("y", function () {
      return 0;
    });

    // restrict from being dragged outside of plot
    resizeButton.adapters.add("x", function (x) {
      return Math.max(0, Math.min(chart.plotContainer.width(), x));
    });

    // change range when x changes
    resizeButton.events.on("dragged", function () {
      const x = resizeButton.x();
      const position = xAxis.toAxisPosition(x / chart.plotContainer.width());
      const value = xAxis.positionToValue(position);
      range.set("value", value);
      seriesRangeDataItem.set("value", value);
      seriesRangeDataItem.set("endValue", xAxis.getPrivate("max"));
    });

    // set bullet for the range
    range.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: resizeButton
    }));

    series.appear(1000);
    series2.appear(1000);
    series3.appear(1000);
    series4.appear(1000);
    chart.appear(1000, 100);
    
    return () => {root.dispose();}; 
  }, [statsData, timeStampBegin, timeStampEnd]);

  return (
    <div id="chartdiv" style={{ width: "75%", height: "500px" }}></div>
  );
}