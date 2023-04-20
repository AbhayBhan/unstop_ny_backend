function removeHtmlTags(str) {
    return str.replace(/(<([^>]+)>)/ig, '');
  }

const dataCleanser = (data) => {
    const responseData = {};

    const description_details = {};

    const route = data.routes[0].legs[0];
    const stepData = data.routes[0].legs[0].steps;

    description_details["distance"] = route.distance;
    description_details["duration"] = route.duration;
    description_details["finalLocation"] = route.end_location;
    description_details["finalAddress"] = route.end_address;
    description_details["startLocation"] = route.start_location;
    description_details["startAddress"] = route.start_address;

    responseData["desc"] = description_details;

    responseData["way"] = [];

    stepData.map((step) => {
        const step_values = {};

        step_values["instruction"] = removeHtmlTags(step.html_instructions);
        step_values["distance"] = step.distance;
        step_values["duration"] = step.duration;
        step_values["startLocation"] = step.start_location;
        step_values["endLocation"] = step.end_location;

        responseData.way.push(step_values);
    });

    return responseData;
}

export default dataCleanser;