import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    riderName : {
        type : String,
        required : true
    },
    driverName : {
        type : String,
        default : "Ramesh"
    },
    gender : {
        type : String,
        required : true
    },
    distance : {
        type : Number,
        required : true
    },
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
    },
    openToCarPool : {
        type : Boolean,
        required : true
    }
});

export default mongoose.model('rides', rideSchema);