import { v4 as uuidv4 } from "uuid";
import amqp, { Connection, Channel, ConsumeMessage, Options } from "amqplib";
import { OnceCallbackType, onceCallback } from "../utils/helpers";

type CreateExArgs = {
  name: string;
  type: string;
  durable?: boolean;
};

type PublishExArgs = {
  exchange: string;
  routingKey: string;
  withReplyTo?: boolean;
  callback?: (msg: ConsumeMessage) => void;
};

type SubscribeExArgs = {
  exchange: string;
  bindingKey: string;
};

class MessageBroker {
  queues: Record<
    string,
    Array<(data: ConsumeMessage, ask: OnceCallbackType) => void>
  >;
  connection: Connection | undefined;
  channel: Channel | undefined;
  exchange: string | undefined;

  constructor() {
    this.queues = {};
  }

  async init(): Promise<MessageBroker> {
    if (this.connection) return this;
    this.connection = await amqp.connect("amqp://localhost", "heartbeat=60");
    this.channel = await this.connection.createChannel();
    return this;
  }

  async createEx({
    name,
    type,
    durable = true,
  }: CreateExArgs): Promise<MessageBroker> {
    if (!this.connection) await this.init();
    await this.channel!.assertExchange(name, type, { durable });
    this.exchange = name;
    return this;
  }

  async publishEx(
    { exchange, routingKey, withReplyTo = false, callback }: PublishExArgs,
    msg: string,
  ): Promise<void> {
    if (!this.connection) await this.init();
    const queue = `${exchange}.${routingKey}`;
    await this.channel!.assertQueue(queue, { durable: true });
    await this.channel!.bindQueue(queue, exchange, routingKey);

    let options: Options.Publish | undefined = undefined;
    if (withReplyTo) {
      options = await this.replyToEx(callback);
    }

    this.channel!.publish(exchange, routingKey, Buffer.from(msg), options);
  }

  private async replyToEx(
    callback: ((msg: ConsumeMessage) => void) | undefined,
  ): Promise<Options.Publish | undefined> {
    const correlationId = uuidv4();

    const queue = await this.channel!.assertQueue("", {
      exclusive: true,
      durable: true,
    });
    await this.channel!.consume(
      queue.queue,
      (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          callback?.(msg);
        }
      },
      {
        noAck: true,
      },
    );

    return {
      replyTo: queue.queue,
      correlationId,
    };
  }

  async subscribeEx(
    { exchange, bindingKey }: SubscribeExArgs,
    handler: (data: ConsumeMessage, ack: () => void) => void,
  ): Promise<() => void> {
    const queue = `${exchange}.${bindingKey}`;
    if (!this.connection) await this.init();
    if (this.queues[queue]) {
      const existingHandler = this.queues[queue]!.find((h) => h === handler);
      if (existingHandler) {
        return () => this.unsubscribeEx(queue, existingHandler);
      }
      this.queues[queue]!.push(handler);
      return () => this.unsubscribeEx(queue, handler);
    }
    await this.channel!.assertQueue(queue, { durable: true });
    await this.channel!.bindQueue(queue, exchange, bindingKey);
    await this.channel!.prefetch(1);
    this.queues[queue] = [handler];
    await this.channel!.consume(
      queue,
      async (msg) => {
        if (!msg) return;
        const ask = onceCallback(() => this.channel!.ack(msg));
        this.queues[queue]!.forEach((h) => h(msg, ask));
      },
      {
        noAck: false,
      },
    );
    return () => this.unsubscribeEx(queue, handler);
  }

  async replyTo({
    replyTo,
    correlationId,
    replyData,
  }: {
    replyTo: string;
    correlationId: string;
    replyData: string;
  }) {
    this.channel!.sendToQueue(replyTo, Buffer.from(replyData), {
      correlationId,
    });
  }

  unsubscribeEx(
    queue: string,
    handler: (data: ConsumeMessage, ack: () => void) => void,
  ): void {
    if (!this.queues[queue]) return;
    this.queues[queue] = this.queues[queue]!.filter((h) => h !== handler);
  }

  async close(): Promise<void> {
    if (!this.connection) return;
    await this.channel!.close();
    await this.connection.close();
  }
}

export default MessageBroker;
