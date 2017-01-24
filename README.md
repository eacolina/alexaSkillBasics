### Alexa Skills 101:
---


# Introduction:

Amazon Alexa is a voice recognition service that allows the integration of voice control to your app or device. In this repo, you will learn how to develop and deploy your own Alexa Skill. In this tutorial, we will be building a custom skill called **superTODO**, which will simply add an element to a TODO list web app via RESTful API's.


# Table of contents:

* [How Alexa works](#H1)
* [Getting ready for development](#H2)
* [Creating a skill in the Developer Portal](#H3)
* [Declaring the interaction model](#H4)
* [Create the AWS Lambda function (backed to process the requests made from Alexa).](#H5)
  * [Anatomy of the Lambda function](#H6)
  * [Hosting your function on AWS.](#H7)
  * [Connect it to your skill.](#H8)
* [Taking it further:](#H9)
  * [Publishing your skill](#H11)


#<a name = "H1">How Alexa works</a>:

In order to develop an Alexa Skill we should first understand how it works by looking at the following use-case:

![](https://developer.amazon.com/public/binaries/content/gallery/developerportalpublic/alexa_smart_home_ecosystem.png)

To do that or to control an app, the system architecture is expected to look like this:
![](https://perkinelmer.box.com/shared/static/psnchr8fvqu5njil35yognio1okzkw43.png)

#<a name = "H2">Getting ready for development</a>:

**NOTE:** To be able to follow this tutorial properly please clone this repository to your computer.

As you probably already know the Alexa engine is powered by Amazon. So in order to develop a skill, you will first need to create an Amazon developer account. To do this go to the <a href = "https://developer.amazon.com"> Amazon Developer Portal </a> and sign in with your account or create a new one. You will also need an Amazon Web Service (AWS) account in order to host the Lambda function that will process the requests from Alexa. When you create the AWS account be sure to select the **US East Region** on the top right corner as it is the only one that supports free Lambda functions.

#<a name = "H3">Creating a skill in the developer portal</a>

The first step towards creating our app is to create a Skill in the developer portal. Go to the [Amazon Developer Portal](https://developer.amazon.com/), log in, then go to the Alexa tab. There select "Add a New Skill" (top right corner). Select a name for your skill(shown in the Amazon Store) and an invocation name (used to call your skill) and leave the skill type as "Custom Interaction Model". Click next to build the interaction model.

#<a name = "H4">Creating the interaction model</a>

As we said before Alexa's apps are called skills. And in order to use those skills, you can either open them by saying: "Alexa open _skill_" and then call the respective functions of such skill. Or you can say "Alexa ask _skillName_ _command_".

The commands used by the skills are called intents.Intents are all the different function that the skill can execute. You will declare them in the intent schema section in JSON format. Here is an example of what it should look like: 

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
The intents array holds intent objects, the interest objects are composed of two components: intent name and slots.Slots are values that can be passed from the user to the intent functions.

Once you have written the intent schema, you will write the utterances. Utterances are the sentences that the user can say to invoke a certain intent, it should have the following format:
``` json
intentName calledSentence
``` 

If you want to pass a value to a slot you can do it like this, ex:

``` json
addNewUser add user named { userToAdd } to the database // whatever the users says between "named" and "to" will be assigned to the variable "userToAdd"
``` 

**NOTE:** Keep in mind that Alexa has difficulties understanding variations of the same sentences unless you clearly state multiple possibilities in the utterances, so declare as many as you like.


To learn more about the interaction model check out the official guide from Amazon: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference.

#<a name = "H5">Create the AWS Lambda function</a>

Some of you might not familiar with the concept of what a Lambda function is.Lambda is a web service provided by Amazon.This server allows the execution of your code when a trigger of your choice is activated.Lambda supports 3 languages: Python, C#, and Node.js.For the purpose of this tutorial, we will use Node.js.

##<a name = "H6">Anatomy of the Lambda function</a>

The power of the Lambda service is that it only executes your code when needed. But, every time your code is called the compiler needs some sort of entry point to your code.This is why we will use handlers.



``` js
 exports.myHandler = function(event, context, callback) {
    ...
   // The event object is the request sent by Alexa in JSON format.
   // Use callback() and return information to the caller.The argument of this function should be JSON.stringify       compatible  
}
``` 

It's this function that will be executed when your Lambda function is called. As stated before all the Alexa API sends a JSON object to Lambda, hence we should send a JSON object back.So bottom line this is all our handler function has to do: build a JSON response object that the Alexa API can understand.

In this repo, you will find the __index.js__ file containing the code (with extensive comments) for the handler function.



##<a name = "H7">Hosting your function in AWS</a>

To create the Lambda function for our skill we need to go to the [AWS](https://aws.amazon.com/) website and log in.

Here select the Lambda option under the Compute section. Create a new Lambda function and select the Blank function template.For the trigger select **'Alexa Skills Kit'**. Give your function a name and for '**Runtime**' select **'Node.js 4.3'**.

Now in the '**Code entry type**' drop-down menu select '**Upload from Zip**' and upload the '**AlexaLambda.zip**' from this repo. In the **'Handler'** section you should enter the name the name that you assigned to you handler following this format: _nameOfJSfile.nameOfHandler_.

In the **'Role'** menu chose **'Create a custom role'**, you will be redirected to the IAM service, leave the default options and click **'Allow'**.Now back in the Lambda portal click **'Next'**, then click **'Create function'**.

You have now created your Lambda function, now we just need to connect it with your skill!

##<a name = "H8">Connect it with your skill</a>
In your Lambda function, there is an ARN identifier on the top right corner, copy this.
Go back to the Developer Portal where we left off and go to the configuration tab.
Here select **'AWS Lambda ARN'** and paste the ARN identifier you just copied.And set **'Account Linking'** to No.

The last thing you need to do is to make sure that your **Application ID** matches the one in the endpoint, which looks like this `amzn1.ask.skill.8b9a4e09-6c0a-45ef-a8a9-3d7aae518ef8`. To do that, open **index.js** file and in line 24 make the following change (you can get the ID next to your skill's name in the developer portal):

``` js
  if (event.session.application.applicationId !== "PASTE YOUR APPPLICATION ID HERE")
``` 

Now compress the following files in on ZIP folder: **index.js, packages.json, node_modules**. Upload this new ZIP file to your Lambda function.

**NOTE:**
We upload these last two files as we are using NPM packages.For this project we used the **alexa-sdk** package and the **http** package to make HTTP requests.
So if you want to start your own project without this boilerplate remember to run the following commands in the directory you are working:

 ``` bash
  npm init
  npm install alexa-sdk http --save


``` 

And CONGRATULATIONS, you have built your own Alexa Skill!
You should now be able to test it under the Test tab, or if you have an Alexa-enabled device linked with the same Amazon account you used for development you can try it there too.

#<a name = "H9">Taking it further</a>
##<a name = "H11">Publishing your skill</a>
_Under development_
##<a name = "H12">Do it your own way</a>
As said before the main purpose of this script is to interpret the JSON object sent from the Alexa API and build another JSON object to send back as response.Hence there are multiple ways to do it.One that should be pointed out because of it simplicity and good documentation is the package
