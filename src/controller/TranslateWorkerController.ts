import { Request, Response } from 'express';
import PubSub = require("@google-cloud/pubsub");
import { GoogleTranslateConfig } from '../config/GoogleTranslateConfig';
import AppConfig from '../config/AppConfig';
export class TranslateWorkerController {
    public async languageTranslateWorker(request: Request, res: Response) {
     //   console.log("Print request ", request.body)
        this.doPubSubConfiguration(request.body, res);
    }


    private async doPubSubConfiguration(requestBody: any, res: Response) {
        const pubSub: PubSub.PubSub = new (PubSub as any).PubSub();
        // pubSub.
        const [topic] = await pubSub.createTopic(AppConfig.PUBSUB_TOPIC_NAME);
        const [subscription] = await topic.createSubscription(AppConfig.PUBSUB_TOPIC_SUBSCRIPTION);
        subscription.on('message', message => {
            message.ack();
            console.log("onMessage recived ", JSON.parse(message.data).quoteText);
            this.clearPubSubData(AppConfig.PUBSUB_TOPIC_SUBSCRIPTION,
                                    AppConfig.PUBSUB_TOPIC_NAME, pubSub,
                                    JSON.parse(message.data).quoteText,res, requestBody.defaultLanguage);
            subscription.close();

        });
        const pubsubData = {
            quoteText: requestBody.quote
        }
        const data = Buffer.from(JSON.stringify(pubsubData));
        topic.publishMessage({ data }, err => {
            if (err) {
                console.log("Inside error block!!!!!!!!!")
            } else {
                console.log("Message published !!!!!!!!!", data.toString())
            }
        });

    }
    private async transalateDataToExpectedlanguage(quoteData: string, res: Response, defaultLanguage:number) {
        const translatedText = await new GoogleTranslateConfig().translateEnglishToFrench(quoteData, defaultLanguage);
        return res.json({
            status: true,
            translatedText
        })

    }

    private async clearPubSubData(subcription: string,
                                  topicID: string,
                                  pubSubClient: PubSub.PubSub,
                                  quoteData: string,
                                  res:Response, defaultLanguage:number) {
        await pubSubClient.topic(topicID).delete();
        console.log("Topic deleted !!!!!!!!!!!")
        await pubSubClient.subscription(subcription).delete();
        console.log("Subscription deleted !!!!!!!!!!!");
        this.transalateDataToExpectedlanguage(quoteData, res, defaultLanguage)

    }

}



