const dataCleanser = (data) => {
    const response_data = {};
    const description_data = {};

    const resData = data.routes[0];
    const routeData = data.routes[0].legs[0];
    const stepData = data.routes[0].legs[0].steps;

    if(resData.fare){
        description_data["fare"] = resData.fare;
    }

    description_data["arrivalTime"] = routeData.arrival_time;
    description_data["departTime"] = routeData.departure_time;
    description_data["distance"] = routeData.distance;
    description_data["duration"] = routeData.duration;
    description_data["finalLocation"] = routeData.end_location;
    description_data["finalAddress"] = routeData.end_address;

    response_data["desc"] = description_data;
    
    response_data["way"] = [];

    const transitFlow = [];
    let count = 0;
    for(let i = 0; i < stepData.length; ++i){
        if(stepData[i].travel_mode === "TRANSIT"){
            if(stepData[i].transit_details.line.vehicle.type === "BUS"){
                transitFlow.push("BUS");
            } else if(stepData[i].transit_details.line.vehicle.type === "SUBWAY"){
                transitFlow.push("METRO");
            }
        }else{
            transitFlow.push("WALKING");
        }
        if(stepData[i].travel_mode === "TRANSIT"){
            ++count;
        }
    };

    response_data["transitFlow"] = transitFlow;
    response_data["suggestFullRide"] = count >= 2 ? true : false;

    stepData.map((step) => {
        const step_values = {};
        const transit_details = {}

        if(step.travel_mode === "WALKING" && step.distance.value >= 800){
            let count = 0;
            step.steps.map((st) => {
                count += st.distance.value;
            })


            step_values["suggestRide"] = true;
            step_values["metroRide"] = false;
            step_values["walkable"] = true;
            step_values["suggestPublicTransport"] = false;
            step_values["duration"] = step.duration;
            step_values["distance"] = step.distance;
            step_values["startLocation"] = step.start_location;
            step_values["finalLocation"] = step.end_location;

            transit_details["type"] = "Walk";
            transit_details["amountOfSteps"] = Math.floor(count/0.76); // taking average of both women & men
            step_values["transitDetails"] = transit_details;
        } else if(step.travel_mode === "TRANSIT"){
            step_values["suggestRide"] = true;
            step_values["metroRide"] = step.transit_details.line.vehicle.type === "SUBWAY" ? true : false;
            step_values["walkable"] = false;
            step_values["suggestPublicTransport"] = true;
            step_values["duration"] = step.duration;
            step_values["distance"] = step.distance;
            step_values["startLocation"] = step.start_location;
            step_values["finalLocation"] = step.end_location;
            
            transit_details["type"] = step.transit_details.line.vehicle.type === "SUBWAY" ? "Metro" : "Bus";
            transit_details["stepsData"] = null;
            transit_details["arrivalStop"] = step.transit_details.arrival_stop;
            transit_details["departureStop"] = step.transit_details.departure_stop;
            transit_details["arrivalTime"] = step.transit_details.arrival_time;
            transit_details["departureTime"] = step.transit_details.departure_time;
            transit_details["transitName"] = step.transit_details.line.short_name || step.transit_details.line.name;
            step_values["transitDetails"] = transit_details;
        } else {
            let count = 0;
            step.steps.map((st) => {
                count += st.distance.value;
            });


            step_values["suggestRide"] = false;
            step_values["metroRide"] = false;
            step_values["walkable"] = true;
            step_values["suggestPublicTransport"] = false;
            step_values["duration"] = step.duration;
            step_values["distance"] = step.distance;
            step_values["startLocation"] = step.start_location;
            step_values["finalLocation"] = step.end_location;
            
            transit_details["type"] = "Walk";
            transit_details["amountOfSteps"] = Math.floor(count/0.76);
            step_values["transitDetails"] = transit_details;
        }
        response_data.way.push(step_values)
    })


    return response_data;
}

export default dataCleanser;