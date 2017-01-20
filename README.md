### Alexa Skills 101:
---


## Introduction:

Amazon Alexa is a voice recognition service that allows easy the integration of voice control to your app or device. In this repo you will learn how to develop an deploy your own Alexa Skill.
For this tutorial we will be building a custom skill called **superTODO**, which will simply add an element to a TODO list web app via using RESTful API's.


## Table of contents:

* How Alexa works
* Getting ready for development
* Creating a skill in the Developer Portal
* Creating the interaction model
* Create the AWS Lambda function (backed to process the requests made from Alexa)
* Taking it further:
  * Connecting your skill with an external API.
  * Publishing your skill to the Amazon dev portal


## How Alexa works:

In order to develop an Alexa Skill we should first understand how it works:

![](https://developer.amazon.com/public/binaries/content/gallery/developerportalpublic/alexa_smart_home_ecosystem.png)

The connection between steps 1 and 2 are internally made by Amazon's API. Hence we will be working on how use data from step 2 to connected it with steps 3 and 4.

## Getting ready for development :
As you probably already know the Alexa engine is powered by Amazon.So in order to develop a skill you will first need to create an Amazon developer account.To do this go to the <a href = "https://developer.amazon.com"> Amazon Developer Portal </a> and sign in with your account or create a new one. You will also need an Amazon Web Service (AWS) account in order to host the Lambda function that will process the requests from Alexa.When you create the AWS account be sure to select the US East region on the top right corner as it is the only one that supports free Lambda functions.

## Creating a skill in the developer portal

The first step towards creating our app is to create a Skill in the developer portal. Go to the [Amazon Developer Portal](https://developer.amazon.com/), login then go to the Alexa tab. There select "Add a New Skill" (top right corner).
Select name of your skill(shown in the Amazon Store) and an invocation name (used to call your skill) and leave the skill type as "Custom Interaction Model". Click next to build the interaction model.

## Creating the interaction model

As we said before Alexa's apps are called skills.And in order to use those skills you can either open them by saying : "Alexa open _skill_" and then calling the respective functions of such skill. Or you can say "Alexa ask _skill_ _command_".

The commands used by the skills are called intents.Intents are all the different function that the skill can execute.You will declare them in the intent schema section in JSON format.Here is an example of what it should look like : 

```json
{
  "intents": [
    {
      "intent": "addNewUser",
      "slots": [
        {
          "name":"userToAdd",
          "type": "AMAZON.Person"
        }
      ]
      
    },
    {
      "intent": "AMAZON.HelpIntent"
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    }
  ]   
}
```
The intents array holds intent objects, teh intenst objects are composed of two components:intent name and slots.Slots are values that can be passed from the user to the intent functions.

Once you have witten the iinetntt schema, you will wite the uterrances. Utterances are the senetces that the user can say to invoke a ceratin intent, it should have the following format:
``` json
intentName calledSentence
``` 

If you want to pass a value to a slot you can do it like this, ex:

``` json
addNewUser add user named { userToAdd } to the database
``` 


To learn more about the interaction model check out the offical guide from Amazon: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference.

## Creating the Lambda function in AWS

Some of you might not familiar with the concept of what a Lambda function is.Lambda is a web service provided by Amazon.This server allows the excecution of your code when a trigger of your choice is activated.Lambda supports 3 languages: Python, C# and Node.js.For the purpose of this tutorial we will use Node.js.

To create the Lambda function for our skill we need to go to the AWS website.

