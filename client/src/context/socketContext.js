import {createContext} from "react";
import { io } from "socket.io-client";
export const socket = io('https://socket.prosper-media.cf')
export const SocketContext = createContext();