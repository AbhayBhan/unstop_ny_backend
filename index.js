import express from "express";
import axios from "axios";
import cors from "cors";
// import {data} from "./mockData.js";
import dataCleanser from "./dataCleaner.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/api", async (req, res) => {
  const { source_lng, source_lat, dest_lng, dest_lat } = req.body;
  try {
    const {data} = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${source_lat},${source_lng}&destination=${dest_lat},${dest_lng}&mode=transit&transit_mode=subway&key=AIzaSyAfZTYWDvvhw53Zi4w_tmqhCYM6MWogBaE`
      );
    res.status(200).send(dataCleanser(data));
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(8000, () => {
  console.log("Server functional.");
});
