import "dotenv/config";
import { createApp } from "./app";

const PORT = Number(process.env.PORT) || 4000;

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});

// Never let an unhandled rejection take the whole process down silently.
process.on("unhandledRejection", (reason) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled promise rejection:", reason);
});
