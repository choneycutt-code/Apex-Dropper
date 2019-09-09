/* eslint-disable no-console */
/* eslint no-use-before-define: ["error", {"functions": false}] */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-arrow-callback */

const Alexa = require('ask-sdk');

const APP_ID = 'amzn1.ask.skill.a622bfa8-e7f8-42e9-8986-947c05d5cc69';
const SKILL_NAME = 'Apex Legends Dropper';
const HELP_MESSAGE = 'Open Apex Legends Dropper and get help deciding where to go. Try saying something like, \"Alexa, ask Apex Dropper for a location\"';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================

//=========================================================================================================================================

function getRandomOpeningMessage() {
  const messages = [
      'Drop at',
      'Head to',
      'Go to',
      'You should go to',
      'Land at',
      'You should land at',
      'Drop into',
      'You should land at',
      'Glide to',
      'Head for',
      'Fly to',
      'Proceed to',
      'Hurry to',
      'Advance towards',
      'Advance to',
      'Take off to'
  ];
  return randomize(messages);
}

function getRandomLocation() {
  const locations = [
      'Airbase',
      'Artillery',
      'Bridges',
      'Bunker',
      'Cascades',
      'Hydro Dam',
      'Market',
      'Relay',
      'Repulsor',
      'Runoff',
      'Skull Town',
      'Slum Lakes',
      'Swamps',
      'The Pit',
      'Thunder dome',
      'Water Treatment',
      'Wetlands'
  ];
  return randomize(locations);
}

function getRandomEndMessage() {
  const endMessages = [
      'Good luck',
      'Have fun',
      'Go get the win',
      'Knock \'em dead',
      'Blow them away',
      'Fingers crossed',
      'Break a leg',
      'Best of luck',
      "Get the win",
      'Take home the crown',
      'Don\'t mess this up',
      'You got this',
      'Try not to die to fast',
      'Try not to die'
  ];
  return randomize(endMessages);
}


//=========================================================================================================================================
// Challenges
//=========================================================================================================================================

function getRandomChallengeOpening() {
  const challengeOpenings = [
      "Let\'s test your skills",
      "Let\'s see how good you really are",
      "This one is going to be impossible",
      "I\'m going to give you a hard one this time",
      "How about we spice things up",
      "Hmm how about we spice things up a bit",
  ];
  return randomize(challengeOpenings);
}

function getRandomChallengeMessage() {
  const challengeMessages = [
      "I challenge you to",
      "Your challenge is to",
      "This time your challenge is to"
  ];
  return randomize(challengeMessages);
}

function getRandomChallenge() {
  const challenges = [
      "only use the first two weapons you find",
      "only open two crates the whole match",
      "only use pistols",
      "only use shotguns",
      "only use sniper rifles",
      "only use large machine guns",
      "only use sub machine guns",
      "only use assault rifles",
      "only use the mozambique and melee",
      "only use energy weapons",
      "only use grey equipment",
      "only use blue equipment",
      "only use purple and gold equipment",
      "not use any attachments on your weapons",
      "not use any sights on any of your weapons",
      "never recharge your shields, however, you are allowed to swap shields",
      "never aim down sights, this means hip fire only",
      "only use the first two guns you find",
      "only use the first weapon you pick up, everything else must be looted from death boxes"
  ];
  return randomize(challenges);
}


//=========================================================================================================================================
//Editing anything below this line might break the skill.
//=========================================================================================================================================

const GetLocationIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'GetLocationIntent';
  },
  handle(handlerInput) {
    const locale = handlerInput.requestEnvelope.request.locale;
    const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return monetizationClient.getInSkillProducts(locale).then(function(res){
      // Filter the list of products available for purchase to find the product with the reference name "Greetings_Pack"
      const challengePackProduct = res.inSkillProducts.filter(
        record => record.referenceName === 'Challenge_Pack'
      );

      if (locale === 'en-US' && isEntitled(challengePackProduct)){
          //Customer has bought the Greetings Pack. They don't need to buy the Greetings Pack.
          const randomMessage = getRandomOpeningMessage();
          const randomLocation = getRandomLocation();
          const randomEndMessage = getRandomEndMessage();

          const speechOutput = randomMessage + " " + randomLocation + ". " + randomEndMessage + "!";

          return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(SKILL_NAME, speechOutput)
            .getResponse();
      }	else if (locale === 'en-UK' && isEntitled(challengePackProduct)){
          //Customer has bought the Greetings Pack. They don't need to buy the Greetings Pack.
          const randomMessage = getRandomOpeningMessage();
          const randomLocation = getRandomLocation();
          const randomEndMessage = getRandomEndMessage();

          const speechOutput = randomMessage + " " + randomLocation + ". " + randomEndMessage + "!";

          return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(SKILL_NAME, speechOutput)
            .getResponse();
      } else if (locale != 'en-US' && locale != 'en-UK') {
          const randomMessage = getRandomOpeningMessage();
          const randomLocation = getRandomLocation();
          const randomEndMessage = getRandomEndMessage();

          const speechOutput = randomMessage + " " + randomLocation + ". " + randomEndMessage + "!";

          return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(SKILL_NAME, speechOutput)
            .getResponse();
      } else {
        //Customer hasn't bought challenge pack.
        //Give location and % chance to get upsell
        const randomMessage = getRandomOpeningMessage();
        const randomLocation = getRandomLocation();
        const randomEndMessage = getRandomEndMessage();
        var randomNum = Math.random();
        var percentChance = 0.33;

        if (randomNum <= percentChance) {
          //given upsell
          const speechOutput = randomMessage + " " + randomLocation + ". " + randomEndMessage + "!";
          return makeUpsell(speechOutput,challengePackProduct,handlerInput);
        } else {
          //not given upsell
          const speechOutput = randomMessage + " " + randomLocation + ". " + randomEndMessage + "!";

          return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(SKILL_NAME, speechOutput)
            .withShouldEndSession(true)
            .getResponse();
        }
      }
    });
  },
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const locale = handlerInput.requestEnvelope.request.locale;
    const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return monetizationClient.getInSkillProducts(locale).then(function(res){
      // Filter the list of products available for purchase to find the product with the reference name "Greetings_Pack"
      const challengePackProduct = res.inSkillProducts.filter(
        record => record.referenceName === 'Challenge_Pack'
      );

    if (locale === 'en-US' && isEntitled(challengePackProduct)){
      //Customer has bought the Greetings Pack. They don't need to buy the Greetings Pack.
      const randomMessage = getRandomOpeningMessage();
      const randomLocation = getRandomLocation();
      const randomChallengeMessage = getRandomChallengeMessage();
      const randomChallenge = getRandomChallenge();
      const randomEndMessage = getRandomEndMessage();

      const speechOutput = randomMessage + " " + randomLocation + ". " + randomChallengeMessage + " " + randomChallenge + ". " + randomEndMessage + "!";

      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(SKILL_NAME, speechOutput)
        .withShouldEndSession(true)
        .getResponse();
    }	else if (locale === 'en-UK' && isEntitled(challengePackProduct)){
      //Customer has bought the Greetings Pack. They don't need to buy the Greetings Pack.
      const randomMessage = getRandomOpeningMessage();
      const randomLocation = getRandomLocation();
      const randomChallengeMessage = getRandomChallengeMessage();
      const randomChallenge = getRandomChallenge();
      const randomEndMessage = getRandomEndMessage();

      const speechOutput = randomMessage + " " + randomLocation + ". " + randomChallengeMessage + " " + randomChallenge + ". " + randomEndMessage + "!";

      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(SKILL_NAME, speechOutput)
        .withShouldEndSession(true)
        .getResponse();
    } else if (locale != 'en-US' && locale != 'en-UK') {
        return GetLocationIntentHandler.handle(handlerInput);
    } else {
        //Customer hasn't bought challenge pack.
        //Give location and % chance to get upsell
        const randomMessage = getRandomOpeningMessage();
        const randomLocation = getRandomLocation();
        const randomEndMessage = getRandomEndMessage();
        var randomNum = Math.random();
        var percentChance = 0.33;

        if (randomNum <= percentChance) {
          const speechOutput = randomMessage + " " + randomLocation + ". " + randomEndMessage + "!";
          return makeUpsell(speechOutput,challengePackProduct,handlerInput);
        } else {
          const speechOutput = randomMessage + " " + randomLocation + ". " + randomEndMessage + "!";
          return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(SKILL_NAME, speechOutput)
            .withShouldEndSession(true)
            .getResponse();
        }
      }
    });
  },
};

const GetChallengeIntentHandler = {

  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'GetChallengeIntent';
  },
  handle(handlerInput) {
    const locale = handlerInput.requestEnvelope.request.locale;
    const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return monetizationClient.getInSkillProducts(locale).then(function(res){
      // Filter the list of products available for purchase to find the product with the reference name "Greetings_Pack"
      const challengePackProduct = res.inSkillProducts.filter(
        record => record.referenceName === 'Challenge_Pack'
      );

    if (locale === 'en-US' && isEntitled(challengePackProduct)) {
      //Customer has bought the Greetings Pack. They don't need to buy the Greetings Pack.
      const randomChallengeOpening = getRandomChallengeOpening();
      const randomChallengeMessage = getRandomChallengeMessage();
      const randomChallenge = getRandomChallenge();
      const randomEndMessage = getRandomEndMessage();

      const speechOutput = randomChallengeOpening + ". " + randomChallengeMessage + " " + randomChallenge + ". " + randomEndMessage + "!";

      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(SKILL_NAME, speechOutput)
        .withShouldEndSession(true)
        .getResponse();
    } if (locale === 'en-UK' && isEntitled(challengePackProduct)) {
          //Customer has bought the Greetings Pack. They don't need to buy the Greetings Pack.
          const randomChallengeOpening = getRandomChallengeOpening();
          const randomChallengeMessage = getRandomChallengeMessage();
          const randomChallenge = getRandomChallenge();
          const randomEndMessage = getRandomEndMessage();

          const speechOutput = randomChallengeOpening + ". " + randomChallengeMessage + " " + randomChallenge + ". " + randomEndMessage + "!";

          return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(SKILL_NAME, speechOutput)
            .withShouldEndSession(true)
            .getResponse();
    } else if (locale != 'en-US' && locale != 'en-UK'){
      const speechOutput = "Unfortunately we cannot offer challenges in your region. However, we can still provide drop locations. You can say something like \"Alexa, ask Apex Dropper for a location.\"";

      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withShouldEndSession(true)
        .getResponse();
    }	else {
        //Customer hasn't bought challenge pack.
        //Make the upsell
        const speechText = "Sorry, it doesn\'t look like you have the Challenge pack.";
        return makeUpsell(speechText,challengePackProduct,handlerInput);
      }
    });
  }
};

const WhatCanIBuyHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "WhatCanIBuyIntent"
    );
  },
  handle(handlerInput) {
    // Inform the user about what products are available for purchase
    const locale = handlerInput.requestEnvelope.request.locale;
    const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return monetizationClient.getInSkillProducts(locale).then(function(res){
      // Filter the list of products available for purchase to find the product with the reference name "Greetings_Pack"
      const purchasableProducts = res.inSkillProducts.filter(
        record =>
          record.entitled === "NOT_ENTITLED" &&
          record.purchasable === "PURCHASABLE"
      );
      const challengePackProduct = res.inSkillProducts.filter(
        record => record.referenceName === 'Challenge_Pack'
      );

        if (locale === 'en-US' && purchasableProducts.length > 0) {
          const speechText = "Here\'s what I found.";
          return makeUpsell(speechText,challengePackProduct,handlerInput);
        } else if (locale === 'en-UK' && purchasableProducts.length > 0) {
          const speechText = "Here\'s what I found.";
          return makeUpsell(speechText,challengePackProduct,handlerInput);
        } else if (locale != 'en-US' && locale != 'en-UK') {
            const speechOutput = "Unfortunately we cannot offer challenges in your region. However, we can still provide drop locations. You can say something like \"Alexa, ask Apex Dropper for a location.\"";

            return handlerInput.responseBuilder
              .speak(speechOutput)
              .withShouldEndSession(true)
              .getResponse();
        } else {
          const speakOutput = `It looks like you already own the Challenge Pack. There are no other products to offer to you right now. Sorry about that.`;
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
          }
    		});
    	}
    };

const BuyChallengePackIntentHandler = {
	canHandle(handlerInput){
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
		handlerInput.requestEnvelope.request.intent.name === 'BuyChallengePackIntent';
	},
	handle(handlerInput){
		const locale = handlerInput.requestEnvelope.request.locale;
		const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return monetizationClient.getInSkillProducts(locale).then(function(res){
			// Filter the list of products available for purchase to find the product with the reference name "Challenge_Pack"
			const challengePackProduct = res.inSkillProducts.filter(
				record => record.referenceName === 'Challenge_Pack'
			);

      if (locale === 'en-US' && isEntitled(challengePackProduct)){
				//Customer has bought the Challenge Pack. They don't need to buy the Challenge Pack.
        const speakOutput = "It looks like you already own the Challenge Pack. If you would like a challenge say something like, \"Alexa, ask Apex Dropper for a challenge\"";

				return handlerInput.responseBuilder
					.speak(speakOutput)
          .withShouldEndSession(true)
					.getResponse();
      } else if (locale === 'en-UK' && isEntitled(challengePackProduct)){
  				//Customer has bought the Challenge Pack. They don't need to buy the Challenge Pack.
          const speakOutput = "It looks like you already own the Challenge Pack. If you would like a challenge say something like, \"Alexa, ask Apex Dropper for a challenge\"";

  				return handlerInput.responseBuilder
  					.speak(speakOutput)
            .withShouldEndSession(true)
  					.getResponse();
  			} else if (locale != 'en-US' && locale != 'en-UK'){
          const speechOutput = "Unfortunately we cannot offer challenges in your region. However, we can still provide drop locations. You can say something like \"Alexa, ask Apex Dropper for a location.\"";

          return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(true)
            .getResponse();
      } else {
				//Make the buy offer for Challenge Pack
				return makeBuyOffer(challengePackProduct,handlerInput);
			}
		});
	}
};

const PurchaseHistoryIntentHandler = {
	canHandle(handlerInput) {
		return (
			handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'PurchaseHistoryIntent'
		);
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return monetizationClient.getInSkillProducts(locale).then(function(res) {
			const entitledProducts = res.inSkillProducts.filter(
        record =>
          record.entitled === "ENTITLED"
      );

			if (entitledProducts && entitledProducts.length > 0) {
				const speechText = `You currently own The Challenge Pack. If you would like to request a challenge, say something like, \"Alexa, ask Apex Dropper for a challenge\"`;

      	return handlerInput.responseBuilder
					.speak(speechText)
					.withShouldEndSession(true)
					.getResponse();
			} else if (locale != 'en-US' && locale != 'en-UK'){
        const speechText = `Unfortunately we cannot offer purchasable products in your region. However, you can still enjoy our free features. You can say something like, \"Alexa, ask Apex Dropper for a location.\"`;

      	return handlerInput.responseBuilder
					.speak(speechText)
					.withShouldEndSession(true)
					.getResponse();
      } else {
  				const speechText = 'You haven\'t purchased anything yet. To learn more about the products you can buy, say, what can I buy.';
  				const repromptOutput = `You asked me to check your purchase history, but you haven't purchased anything yet. You can say, what can I buy.`;

  				return handlerInput.responseBuilder
  					.speak(speechText)
  					.reprompt(repromptOutput)
  					.getResponse();
			}
		});
	}
};

const RefundChallengePackIntentHandler = {
	canHandle(handlerInput) {
		return (
			handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RefundChallengePackIntent'
		);
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return monetizationClient.getInSkillProducts(locale).then(function(res) {
			const premiumProduct = res.inSkillProducts.filter(
				record => record.referenceName === 'Challenge_Pack'
			);
			return handlerInput.responseBuilder
				.addDirective({
					type: 'Connections.SendRequest',
					name: 'Cancel',
					payload: {
						InSkillProduct: {
							productId: premiumProduct[0].productId
						}
					},
					token: 'correlationToken'
				})
				.getResponse();
		});
	}
};

//handles after purchase //ACCEPTED or DECLINED
const ConnectionsResponseHandler = {
  canHandle(handlerInput){
		return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
        (handlerInput.requestEnvelope.request.name === 'Buy' ||
        handlerInput.requestEnvelope.request.name === 'Upsell');
	},
  handle(handlerInput) {
    switch (handlerInput.requestEnvelope.request.payload.purchaseResult) {
          case "ACCEPTED":
            const speakText = "To request a challenge, try saying something like, \"give me a challenge\"";
            const repromptOutput = "You just purchased the challenge pack. To use it, try saying something like, \"give me a challenge\""

            return handlerInput.responseBuilder
              .speak(speakText)
              .reprompt(repromptOutput)
              .getResponse();
            break;
          case "DECLINED":
            const speakOutput = "Maybe next time.";

            return handlerInput.responseBuilder
              .speak(speakOutput)
              .withShouldEndSession(true)
              .getResponse();
            break;
          default:
            return GetLocationIntentHandler.handle(handlerInput);
            break;
    }
  },
};

const CancelProductResponseHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Cancel';
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();
		const productId = handlerInput.requestEnvelope.request.payload.productId;

		return monetizationClient.getInSkillProducts(locale).then(function(res) {
			const product = res.inSkillProducts.filter(
				record => record.productId === productId
			);

			console.log(
				`PRODUCT = ${JSON.stringify(product)}`
			);

			if (handlerInput.requestEnvelope.request.status.code === '200') {
				//Alexa handles the speech response immediately following the cancelation reqquest.
				//It then passes the control to our CancelProductResponseHandler() along with the status code (ACCEPTED, DECLINED, NOT_ENTITLED)
				//We use the status code to stitch additional speech at the end of Alexa's cancelation response.
				//Currently, we have the same additional speech (getRandomYesNoQuestion)for accepted, canceled, and not_entitled. You may edit these below, if you like.
				if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'ACCEPTED') {
					//The cancelation confirmation response is handled by Alexa's Purchase Experience Flow.
					//Simply add to that with getRandomYesNoQuestion()
          const speechText = 'We are sorry to see you go. We hope you continue to enjoy our other features';

  				return handlerInput.responseBuilder
  					.speak(speechText)
  					.withShouldEndSession(true)
  					.getResponse();
				}
				else if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'DECLINED') {
          const speechText = 'We\'re sorry to see you go.';

  				return handlerInput.responseBuilder
  					.speak(speechText)
  					.withShouldEndSession(true)
  					.getResponse();
				}
				else if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'NOT_ENTITLED') {
					//No subscription to cancel.
					//The "No subscription to cancel" response is handled by Alexa's Purchase Experience Flow.
					//Simply add to that with getRandomYesNoQuestion()
          const speechText = 'It doesn\'t look like you currently own Apex Dropper\'s Challenge Pack';

  				return handlerInput.responseBuilder
  					.speak(speechText)
  					.withShouldEndSession(true)
  					.getResponse();
				}
        const speechText = 'We are sorry to see you go. We hope you continue to enjoy our other features.';

				return handlerInput.responseBuilder
					.speak(speechText)
					.getResponse();
			}
			// Something failed.
			console.log(
				`Connections.Response indicated failure. error: ${handlerInput.requestEnvelope.request.status.message}`
			);

			return handlerInput.responseBuilder
				.speak('There was an error handling your purchase request. Please try again or contact us for help.')
				.getResponse();
		});
	},
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const preMessage = "Hmm, I\'m not sure what you\'re asking, but you should";
    const randomMessage = getRandomOpeningMessage();
    const randomLocation = getRandomLocation();
    const randomEndMessage = getRandomEndMessage();

    const speechOutput = preMessage + " " + randomMessage + " " + randomLocation + ". " + randomEndMessage + "!";

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    const preMessage = "Hmm, something went wrong, but you should";
    const randomMessage = getRandomOpeningMessage();
    const randomLocation = getRandomLocation();
    const randomEndMessage = getRandomEndMessage();

    const speechOutput = preMessage + " " + randomMessage + " " + randomLocation + ". " + randomEndMessage + "!";

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .withShouldEndSession(true)
      .getResponse();

    // return handlerInput.responseBuilder
    //   .speak(`Error handled: ${error.message}`)
    //   .withShouldEndSession(true)
    //   .getResponse();
  },
};

function randomize(array){
	const randomItem = array[Math.floor(Math.random() * array.length)];
	return randomItem;
}

function getRandomLearnMorePrompt() {
	const questions = [
		'Want to learn more about it?',
		'Should I tell you more about it?',
		'Want to learn about it?',
		'Interested in learning more about it?'
	];
	return randomize(questions);
}

function makeUpsell(preUpsellMessage,challengePackProduct,handlerInput){
	let upsellMessage = `${preUpsellMessage} ${challengePackProduct[0].summary}. ${getRandomLearnMorePrompt()}`;

	return handlerInput.responseBuilder
		.addDirective({
			type: 'Connections.SendRequest',
			name: 'Upsell',
			payload: {
				InSkillProduct: {
					productId: challengePackProduct[0].productId
				},
				upsellMessage
			},
			token: 'correlationToken'
		})
		.getResponse();
}

function makeBuyOffer(theProduct,handlerInput){

	return handlerInput.responseBuilder
		.addDirective({
			type: 'Connections.SendRequest',
			name: 'Buy',
			payload: {
				InSkillProduct: {
					productId: theProduct[0].productId
				}
			},
			token: 'correlationToken'
		})
		.getResponse();
}

function isProduct(product) {
	return product && product.length > 0;
}

function isEntitled(product) {
	return isProduct(product) && product[0].entitled === 'ENTITLED';
}

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .withSkillId("amzn1.ask.skill.a622bfa8-e7f8-42e9-8986-947c05d5cc69")
  .addRequestHandlers(
    LaunchRequestHandler,
    GetLocationIntentHandler,
    GetChallengeIntentHandler,
    WhatCanIBuyHandler,
    BuyChallengePackIntentHandler,
    PurchaseHistoryIntentHandler,
    RefundChallengePackIntentHandler,
    ConnectionsResponseHandler,
    CancelProductResponseHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler,
    FallbackHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
