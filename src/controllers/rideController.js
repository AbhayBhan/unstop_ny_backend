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

export const getRides = asyncHandler(async (req,res) => {
    const {startTime} = req.body;

    const rides = await RIDE.find({});
    let response_data = [];

    rides.map((ride) => {
        if(ride.startTime >= startTime - 300){
            const data = {
                northEast : {
                    lat : ride.sourceLat,
                    lng : ride.sourceLng
                },
                southWest : {
                    lat : ride.destLat,
                    lng : ride.destLng
                },
                poolingId : ride._id
            }

            response_data.push(data);
        } //if the ride has been going for only 5 minutes.
    })

    res.status(200).send(response_data);
})