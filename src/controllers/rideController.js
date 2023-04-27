import asyncHandler from "express-async-handler";
import RIDE from "../models/rideModel.js";
import { calculateDistance, getBearing, getNewLats } from "../utils/utils.js";
import axios from "axios";

export const makeRide = asyncHandler(async (req, res) => {
  const {
    riderName,
    gender,
    distance,
    duration,
    sourceLat,
    sourceLng,
    destLat,
    destLng,
    startTime,
    openToCarPool,
  } = req.body;

  const newRide = await RIDE.create({
    riderName,
    gender,
    distance,
    duration,
    sourceLat,
    sourceLng,
    destLat,
    destLng,
    startTime,
    openToCarPool,
  });

  if (!newRide) {
    throw new Error("Couldn't Create Ride");
  }

  res.status(201).send(newRide);
});

export const getRides = asyncHandler(async (req, res) => {
  const { sourceLat, sourceLng, startTime } = req.body;

  const rides = await RIDE.find({ openToCarPool: true });
  const process_data = [];
  let final_res = {};

  rides.map((ride) => {
    let currentDistance;

    currentDistance =
      (ride.distance / ride.duration) *
      (startTime - ride.startTime); //speed in m/s, time in s, and currentDist in metres
    const bearing = getBearing(
      ride.sourceLat,
      ride.sourceLng,
      ride.destLat,
      ride.destLng
    );

    const { currentLat, currentLon } = getNewLats(
      ride.sourceLat,
      ride.sourceLng,
      bearing,
      currentDistance
    );

    const data = {
      sourceLocation: {
        lat: ride.sourceLat,
        lng: ride.sourceLng,
      },
      destLocation: {
        lat: ride.destLat,
        lng: ride.destLng,
      },
      currentLocation: {
        lat: currentLat,
        lng: currentLon,
      },
      gender: ride.gender,
      riderName: ride.riderName,
      poolingId: ride._id,
    };

    process_data.push(data);
  });

  if (process_data.length === 0) {
    res.status(200).send({});
    return;
  }

  let nearestRide = process_data[0].currentLocation;
  let nearestDistance = calculateDistance(
    sourceLat,
    sourceLng,
    nearestRide.lat,
    nearestRide.lng
  );
  final_res = process_data[0];

  for (let i = 1; i < process_data.length; i++) {
    //final filter to check for the nearest ride
    const distance = calculateDistance(
      sourceLat,
      sourceLng,
      process_data[i].currentLocation.lat,
      process_data[i].currentLocation.lng
    );
    if (distance < nearestDistance) {
      nearestDistance = distance;
      final_res = process_data[i];
    }
  }

  if (nearestDistance > 3) {
    // if not in 3km radius, carpool not available
    final_res = {};
  }
  final_res["proximity"] = nearestDistance;

  res.status(200).send(final_res);
});
