import { React } from "react";
import { Box, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function TimePicker({ timeStampBegin, setTimeStampBegin, timeStampEnd, setTimeStampEnd }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h2" fontSize={20} marginBottom="30px" >
        Time Range:
      </Typography>

      <DateTimePicker
        sx={{ marginBottom: "30px" }}
        label="Start time"
        value={dayjs(timeStampBegin)}
        onChange={(newValue) => setTimeStampBegin(newValue.$d.getTime())}
      />

      <DateTimePicker
        label="End time"
        value={dayjs(timeStampEnd)}
        onChange={(newValue) => setTimeStampEnd(newValue.$d.getTime())}
      />
    </Box>
  )
}