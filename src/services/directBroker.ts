import type { ConsumeMessage } from "amqplib";
import MessageBroker from "./messageBroker";

type DirectBrokerProviderArgs = {
  exchange: string;
  routingKey: string;
  message: unknown;
};

type DirectBrokerConsumerArgs = {
  exchange: string;
  bindingKey: string;
  callback: (message: ConsumeMessage) => Promise<void>;
};

class DirectBroker {
  private readonly broker: MessageBroker;

  constructor(broker: MessageBroker) {
    this.broker = broker;
  }

  public async provider(args: DirectBrokerProviderArgs) {
    const { message, exchange, routingKey } = args;

    await this.broker.createEx({ name: exchange, type: "direct" });
    await this.broker.publishEx(
      { exchange, routingKey },
      JSON.stringify(message),
    );
  }

  public async consumer(args: DirectBrokerConsumerArgs) {
    const { callback, exchange, bindingKey } = args;

    await this.broker.createEx({ name: exchange, type: "direct" });
    await this.broker.subscribeEx(
      { exchange, bindingKey },
      async (msg, ack) => {
        await callback(msg);
        ack();
      },
    );
  }
}

export default DirectBroker;
