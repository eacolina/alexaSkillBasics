/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.


// Keep in mind that all of your logs are accesible through Amazon's CloudWatch.



var http = require('http'); // variable storing an http object essetial to make an HTTP request

exports.handler = function (event, context) { // handler function that will be executed when the Lambda server gets a request
    try {
        console.log("The application ID is:" + event.session.application.applicationId); // log the application ID for control purpose
        console.log(JSON.stringify(event));
        if (event.session.application.applicationId !== "amzn1.ask.skill.6f2841dd-a8ef-45c0-b071-7976c1930092") { // check the application that's making the request is in fact your skill
             context.fail("This application ID does not correspond to your Alexa Skill");
        }
        if (event.session.new) { // keep note if this is a new session
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") { // check if the user asked to open your skill wihout a specfic intent
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") { // when the user called an intent
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse)); // this function will indentfy the indent and return an JSON object to the callback functin
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

function api(endpoint, cb) { // function used to make the API call to our superTodo server

    return http.get({
        host: 'murmuring-brushlands-77566.herokuapp.com',
        path: endpoint
    }, function(res) {
        res.setEncoding('utf8');
        // Continuously update stream with data
        var body = '';
        res.on('data', function(d) {
            body += d;
        });
        res.on('end', function() {

            try {
                console.log(body);
                var parsed = JSON.parse(body);
                cb(parsed);
                //return parsed.MRData;
            } catch (err) {
                console.error('Unable to parse response as JSON', err);
                throw(err);
            }
        });
    }).on('error', function(err) {
        // handle errors with the request itself
        console.error('Error with the request:', err.message);
        throw(err);
    });

}

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
   This function will indentfy the indent and return an JSON object to the callback function.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    this.cb = callback;

    var parameter = intentRequest.intent.slots.userToAdd.value; // here we get the value of a slot
    switch(intentName) {
        case "addNewUser": // method for adding a newUser to the list
            api(('/methods/' + parameter), function() { // make the API call to superTodo
                var cardTitle = 'A new user has been added'; // set the card title for the Alexa App
                var shouldEndSession = true; //remember to end session after intent
                var speechOutput = parameter + " has been added to the database"; // spech output
                this.cb({}, buildSpeechletResponse(cardTitle, speechOutput, speechOutput, shouldEndSession)); // build a portion of the final JSON response
                // pass it to callback funtion from onIntent
            }.bind(this)); // pass it to callback funtion from the exports handler to be sent to the Alexa API
            break;

        case "AMAZON.HelpIntent":
                getWelcomeResponse(callback);
            break;

        case "AMAZON.StopIntent":
        case "AMAZON.CancelIntent":
        default:
            handleSessionEndRequest(callback);
            break;
    }

}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome to Super Todo!"; // title of the card displayed on the Alexa App
    var speechOutput = "Super Todo will help you add items to your list!"; // Alexa's speechOutput
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For example you can say:" +
    "Navigate to: to naviagte to a certain view" +
    "Or you can ask Lab Wizard to run an experimnet for you by saying:" +
    "Run experiment 5";
    var shouldEndSession = false;

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "You have succesfully exited the Lab Wizard Skill"; //"Session Ended";
    var speechOutput = "Thanks for using Lab Wizard"; //"Thank you for trying the Alexa Skills Kit sample. Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------
// --------------- Here the final JSON response gets built -----------------------
// --------------- To better understand please refer to the example response file "Response2Alexa.json"

function buildSpeechletResponse(card_title, speech_output, repromptText, shouldEndSession) { // this builds the speech and card parameters of the function
    return {
        outputSpeech: {
            type: "PlainText",
            text: speech_output
            //type: "SSML",
            //text: "<speak>" + output + "</speak>"
        },
        card: {
            type: "Simple",
            title: card_title,
            content: speech_output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) { // binds all of the information to build a final response
    console.log("The response will be sent as follows:");
    console.log(JSON.stringify(
      {
          version: "1.0",
          sessionAttributes: sessionAttributes,
          response: speechletResponse
      }
    ));

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
