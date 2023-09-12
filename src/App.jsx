import { React, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Chart from "./components/Chart";
import TimePicker from "./components/TimePicker";
import 'dayjs/locale/de';

export default function App() {
  const [timeStampBegin, setTimeStampBegin] = useState(1693072800000);
  const [timeStampEnd, setTimeStampEnd] = useState(1693677599999);

  return(
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de"> 
      <Container maxWidth="100%" sx={{ marginTop: "50px"}}>
        <Typography variant="h1" fontSize="30px" marginBottom="50px" marginLeft="50px" fontWeight="500" > 
          Average fuel level chart 
        </Typography>

        <Box sx={{ display: "flex", gap: "50px"}}>
          <Chart 
            timeStampBegin={timeStampBegin}
            timeStampEnd={timeStampEnd}
          />
          <TimePicker 
            timeStampBegin={timeStampBegin}
            setTimeStampBegin={setTimeStampBegin}
            timeStampEnd={timeStampEnd}
            setTimeStampEnd={setTimeStampEnd}
          />
        </Box>
      </Container>  
    </LocalizationProvider>
  )
}