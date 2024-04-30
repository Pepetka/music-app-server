import type { ConsumeMessage } from "amqplib";
import MessageBroker from "./messageBroker";

type DirectBrokerProviderArgs = {
  exchange: string;
  routingKey: string;
  message: unknown;
  autoClose?: boolean;
};

type DirectBrokerConsumerArgs = {
  exchange: string;
  bindingKey: string;
  callback: (message: ConsumeMessage) => Promise<void>;
  autoClose?: boolean;
};

class DirectBroker {
  static async provider(args: DirectBrokerProviderArgs) {
    const { message, exchange, routingKey, autoClose = true } = args;

    const broker = await new MessageBroker().init();
    await broker.createEx({ name: exchange, type: "direct" });
    await broker.publishEx({ exchange, routingKey }, JSON.stringify(message));
    if (autoClose) {
      await broker.close();
    }
  }

  static async consumer(args: DirectBrokerConsumerArgs) {
    const { callback, exchange, bindingKey, autoClose = false } = args;

    const broker = await new MessageBroker().init();
    await broker.createEx({ name: exchange, type: "direct" });
    await broker.subscribeEx({ exchange, bindingKey }, async (msg, ack) => {
      await callback(msg);
      ack();
    });
    if (autoClose) {
      await broker.close();
    }
  }
}

export default DirectBroker;
