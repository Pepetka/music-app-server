import type { ConsumeMessage } from "amqplib";
import MessageBroker from "./messageBroker";

type RpcBrokerProviderArgs = {
  exchange: string;
  routingKey: string;
  message: unknown;
  autoClose?: boolean;
  callback?: (message: ConsumeMessage) => void;
};

type RpcBrokerConsumerArgs = {
  exchange: string;
  bindingKey: string;
  callback: (message: ConsumeMessage) => Promise<string>;
  autoClose?: boolean;
};

class RpcBroker {
  static async provider(args: RpcBrokerProviderArgs) {
    const { message, exchange, routingKey, autoClose = true, callback } = args;

    const broker = await new MessageBroker().init();
    await broker.createEx({ name: exchange, type: "direct" });
    await broker.publishEx(
      {
        exchange,
        routingKey,
        withReplyTo: true,
        callback: (msg) => {
          callback?.(msg);
          if (autoClose) {
            broker.close();
          }
        },
      },
      JSON.stringify(message),
    );
  }

  static async consumer(args: RpcBrokerConsumerArgs) {
    const { callback, exchange, bindingKey, autoClose = false } = args;

    const broker = await new MessageBroker().init();
    await broker.createEx({ name: exchange, type: "direct" });
    await broker.subscribeEx({ exchange, bindingKey }, async (msg, ack) => {
      const replyData = await callback(msg);
      await broker.replyTo({
        replyTo: msg.properties.replyTo,
        correlationId: msg.properties.correlationId,
        replyData,
      });
      ack();
    });
    if (autoClose) {
      await broker.close();
    }
  }
}

export default RpcBroker;
