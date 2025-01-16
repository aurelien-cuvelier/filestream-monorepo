import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import Fastify, { FastifyInstance } from "fastify";
import fs from "fs";

import { StatusCodes } from "http-status-codes";

const server: FastifyInstance = Fastify({ logger: true });
const UPLOAD_PATH = "./files";

server.register(fastifyCors, {
  origin: true, //Allowing all origin
});

server.register(fastifyMultipart);

server.post("/upload", async (request, reply) => {
  const data = await request.file();

  if (!data) {
    return reply
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "No file uploaded!" });
  }

  const allowedTypes = ["image/png", "image/jpeg"];
  if (!allowedTypes.includes(data.mimetype)) {
    return reply
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Invalid file type!" });
  }

  if (data.file.truncated) {
    return reply
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "File size too large!" });
  }

  const uploadPath = UPLOAD_PATH + `/${data.filename}`;

  await new Promise<void>((resolve, reject) => {
    const fileStream = fs.createWriteStream(uploadPath);
    data.file.pipe(fileStream);

    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });

  return reply.send({ message: "File uploaded successfully!" });
});

const start = async () => {
  try {
    const PORT = 3000;
    await server.listen({ port: PORT });
  } catch (err: unknown) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
