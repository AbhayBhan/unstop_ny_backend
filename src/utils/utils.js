export function calculateDistance(lat1, lng1, lat2, lng2){
    //HAVERSINE DISTANCE FORMULA
    //convert deg to rad
    const lat1RAD = getRADFromDEG(lat1);
    const lat2RAD = getRADFromDEG(lat2);
    const lng1RAD = getRADFromDEG(lng1);
    const lng2RAD = getRADFromDEG(lng2);

    let a = lat2RAD - lat1RAD;
    let b = lng2RAD - lng1RAD;

    //haversine formula parts
    let c = (1 - Math.cos(a))/2;
    let d = (1 - Math.cos(b))/2;
    
    let haversineRAD = c + (Math.cos(lat1RAD) * Math.cos(lat2RAD) * d);
    let centralAngleRAD = Math.acos(1- (2*haversineRAD));
    return centralAngleRAD * 6378; //6378 is earth's radius
}

function getRADFromDEG (val) {
    return val * Math.PI/180;
}