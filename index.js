import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import transitDataCleanser from "./src/dataCleansers/transitDataCleanser.js";
import driveDataCleanser from "./src/dataCleansers/driveDataCleanser.js";
import { getRides, makeRide } from "./src/controllers/rideController.js";

const de = dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/publicroute", async (req, res) => {
  const { source_lng, source_lat, dest_lng, dest_lat } = req.body;
  try {
    const {data} = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${source_lat},${source_lng}&destination=${dest_lat},${dest_lng}&mode=transit&transit_mode=subway&key=${process.env.NODE_MAP_API_KEY}`
      );
    res.status(200).send(transitDataCleanser(data));
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/driveroute", async (req, res) => {
  const {source_lat, source_lng, dest_lat, dest_lng} = req.body;
  try{
    const {data} = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${source_lat},${source_lng}&destination=${dest_lat},${dest_lng}&mode=driving&key=${process.env.NODE_MAP_API_KEY}`
    );
    res.status(200).send(driveDataCleanser(data));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/getpool", getRides);

app.post("/postride", makeRide);

mongoose.connect(process.env.MONGO_CONN_KEY)
  .then(() => {
    app.listen(8000, () => {
      console.log("Server functional.");
    });
  }).catch((err) => {
    console.error(err);
  });
