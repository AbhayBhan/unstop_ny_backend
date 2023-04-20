import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    sourceLat : {
        type : String,
        required : true
    },
    sourceLng : {
        type : String,
        required : true
    },
    destLat : {
        type : String,
        required : true
    },
    destLng : {
        type : String,
        required : true
    },
    startTime : {
        type :  Number,
        required : true
    }
});

export default mongoose.model('rides', rideSchema);