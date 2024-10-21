import { env } from "process";
import { createServer, request } from "http";
import { cpus, availableParallelism } from "os";
import cluster, { Cluster } from "cluster";
import { config as dotenvConfig } from "dotenv";
import { routes } from "./routes";
import { createPortGenerator } from "./utils";

dotenvConfig();
const PORT = Number(env.PORT) || 4000;

const numCPUs = availableParallelism() - 1;
const generatePort = createPortGenerator(PORT, numCPUs);

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    const workerPort = PORT + i + 1;
    cluster.fork({ WORKER_PORT: workerPort });
  }

  const loadBalancer = createServer((req, res) => {
    const workerPort = generatePort();

    const proxy = request(
      {
        hostname: "localhost",
        port: workerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (workerRes) => {
        const code = workerRes.statusCode || 500;
        res.writeHead(code, workerRes.headers);
        workerRes.pipe(res);
      }
    );

    req.pipe(proxy);
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer is running on port ${PORT}`);
  });
} else {
  const workerPort = process.env.WORKER_PORT;
  createServer(routes).listen(workerPort, () => {
    console.log(`Worker server is running on port ${workerPort}`);
  });
}
