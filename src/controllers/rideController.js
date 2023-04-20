import asyncHandler from 'express-async-handler';
import RIDE from '../models/rideModel.js';

export const makeRide = asyncHandler(async (req,res) => {
    const {sourceLat, sourceLng, destLat, destLng, startTime} = req.body;

    const newRide = await RIDE.create({sourceLat, sourceLng, destLat, destLng, startTime});

    if(!newRide){
        throw new Error("Couldn't Create Ride");
    }

    res.status(201).send(newRide);
})