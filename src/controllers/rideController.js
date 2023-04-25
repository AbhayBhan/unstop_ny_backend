import asyncHandler from 'express-async-handler';
import RIDE from '../models/rideModel.js';
import { calculateDistance } from '../utils/utils.js';

export const makeRide = asyncHandler(async (req,res) => {
    const {riderName, gender, distance, sourceLat, sourceLng, destLat, destLng, startTime, openToCarPool} = req.body;

    const newRide = await RIDE.create({riderName, gender, distance, sourceLat, sourceLng, destLat, destLng, startTime, openToCarPool});

    if(!newRide){
        throw new Error("Couldn't Create Ride");
    }

    res.status(201).send(newRide);
})

export const getRides = asyncHandler(async (req,res) => {
    const {sourceLat, sourceLng, startTime} = req.body;

    const rides = await RIDE.find({openToCarPool : true}); //first filter to check who is open to car pool
    let final_res = {};
    let response_data = [];

    rides.map((ride) => {
        if(ride.startTime >= startTime - 300){
            const data = {
                sourceLocation : {
                    lat : ride.sourceLat,
                    lng : ride.sourceLng
                },
                destLocation : {
                    lat : ride.destLat,
                    lng : ride.destLng
                },
                gender : ride.gender,
                riderName : ride.riderName,
                poolingId : ride._id
            }

            response_data.push(data);
        } //second filter to check if the ride has been going for only 5 minutes.
    });

    let nearestRide = response_data[0].sourceLocation;
    let nearestDistance = calculateDistance(sourceLat, sourceLng, nearestRide.lat, nearestRide.lng);
    final_res = response_data[0];

    for (let i = 1; i < response_data.length; i++) { //final filter to check for the nearest ride
        const distance = calculateDistance(sourceLat, sourceLng, response_data[i].sourceLocation.lat, response_data[i].sourceLocation.lng);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          final_res = response_data[i];
        }
      }
    
    if(nearestDistance > 3000){ // if not in 3km radius, carpool not available
        final_res = {};
    }

    res.status(200).send(final_res);
})