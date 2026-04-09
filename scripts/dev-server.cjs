const path = require("path");
const { startServer } = require("next/dist/server/lib/start-server");

async function main() {
  const dir = process.cwd();
  const port = Number.parseInt(process.env.PORT || "3000", 10);
  const hostname = process.env.HOST || process.env.HOSTNAME || undefined;

  await startServer({
    dir: path.resolve(dir),
    port: Number.isFinite(port) ? port : 3000,
    allowRetry: true,
    isDev: true,
    hostname,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
