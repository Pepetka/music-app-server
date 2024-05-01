import type { ConsumeMessage } from "amqplib";
import DirectBroker from "../directBroker";
import RpcBroker from "../rpcBroker";
import logger from "../../utils/logger";
import MessageBroker from "../messageBroker";

(async () => {
  const broker = new MessageBroker();

  const directBroker = new DirectBroker(broker);
  const handler = async (msg: ConsumeMessage) => {
    console.log("test: ", msg.content.toString());
  };
  await directBroker.consumer({
    exchange: "testExchange",
    bindingKey: "testKey",
    callback: handler,
  });

  const rpcBroker = new RpcBroker(broker);
  const rpcHandler = async (msg: ConsumeMessage) => {
    console.log("test rpc: ", msg.content.toString());

    return "Test reply data";
  };
  await rpcBroker.consumer({
    exchange: "testRpcExchange",
    bindingKey: "testRpcKey",
    callback: rpcHandler,
  });

  logger.debug("Test service started");

  const onShutdown = () => {
    try {
      broker.unsubscribeEx("testExchange", handler);
      broker.unsubscribeEx("testRpcExchange", rpcHandler);
      broker.close();
      logger.debug("Test service stopped");
      logger.close();
      process.exit(0);
    } catch (error: unknown) {
      logger.error(error);
      logger.close();
      process.exit(1);
    }
  };

  process.on("SIGINT", onShutdown);
  process.on("SIGTERM", onShutdown);
})();
