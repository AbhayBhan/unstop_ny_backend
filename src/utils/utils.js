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

export function getBearing(lat1, lng1, lat2, lng2){
    const lat1RAD = getRADFromDEG(lat1);
    const lat2RAD = getRADFromDEG(lat2);
    const lng1RAD = getRADFromDEG(lng1);
    const lng2RAD = getRADFromDEG(lng2);

    const dlng = lng2RAD - lng1RAD;

    let a = Math.sin(dlng) * Math.cos(lat2RAD);
    let b = (Math.cos(lat1RAD) * Math.sin(lat2RAD)) - (Math.sin(lat1RAD) * Math.cos(lat2RAD) * Math.cos(dlng));
    
    const bearing = Math.atan2(a, b) * (180 / Math.PI);
    return bearing;
}

export function getNewLats(lat, lon, bearing, distance){
    const latRAD = getRADFromDEG(lat);
    const lonRAD = getRADFromDEG(lon);
    
    const brng = getRADFromDEG(bearing);
    const d = distance/1000;

    const newLat = Math.asin((Math.sin(latRAD) * Math.cos(d/6378)) + (Math.cos(latRAD) * Math.sin(d/6378) * Math.cos(brng)));
    const newLon = lonRAD + Math.atan2(Math.sin(brng) * Math.sin(d/6378) * Math.cos(latRAD), Math.cos(d/6378) - Math.sin(latRAD) * Math.sin(newLat));

    const res = {
        currentLat : getDEGFromRAD(newLat),
        currentLon : getDEGFromRAD(newLon)
    }

    return res;
}

function getRADFromDEG (val) {
    return val * Math.PI/180;
}

function getDEGFromRAD (val) {
    return val * 180/Math.PI;
}