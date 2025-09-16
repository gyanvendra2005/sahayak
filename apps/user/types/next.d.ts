import { Server as IOServer } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any & {
    server: {
      io?: IOServer;
    };
  };
};
