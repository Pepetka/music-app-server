import type { ConsumeMessage } from "amqplib";
import MessageBroker from "./messageBroker";

type RpcBrokerProviderArgs = {
  exchange: string;
  routingKey: string;
  message: unknown;
  callback?: (message: ConsumeMessage) => void;
};

type RpcBrokerConsumerArgs = {
  exchange: string;
  bindingKey: string;
  callback: (message: ConsumeMessage) => Promise<string>;
};

class RpcBroker {
  private readonly broker: MessageBroker;

  constructor(broker: MessageBroker) {
    this.broker = broker;
  }

  public async provider(args: RpcBrokerProviderArgs) {
    const { message, exchange, routingKey, callback } = args;

    await this.broker.createEx({ name: exchange, type: "direct" });
    await this.broker.publishEx(
      {
        exchange,
        routingKey,
        withReplyTo: true,
        callback,
      },
      JSON.stringify(message),
    );
  }

  public async consumer(args: RpcBrokerConsumerArgs) {
    const { callback, exchange, bindingKey } = args;

    await this.broker.createEx({ name: exchange, type: "direct" });
    await this.broker.subscribeEx(
      { exchange, bindingKey },
      async (msg, ack) => {
        const replyData = await callback(msg);
        await this.broker.replyTo({
          replyTo: msg.properties.replyTo,
          correlationId: msg.properties.correlationId,
          replyData,
        });
        ack();
      },
    );
  }
}

export default RpcBroker;
