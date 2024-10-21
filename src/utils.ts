import { IncomingMessage } from "node:http";

export const parseBody = async (req: IncomingMessage) => {
  let body = "";
  await req.on("data", (chunk) => (body += chunk));
  return JSON.parse(body);
};

export const findUserIdByUrl = (url?: string) => {
  if (!url) return undefined;
  const splittedUrl = url.split("/");
  if (splittedUrl.length < 4) return undefined;
  return splittedUrl[3];
};

export const createPortGenerator = (port: number, workersAmount: number) => {
  let currentPort = port;
  const maxPort = port + workersAmount;

  return () => {
    if (currentPort === maxPort) {
      currentPort = port;
    }

    currentPort++;
    return currentPort;
  };
};
