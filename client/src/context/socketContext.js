import {createContext} from "react";
import { io } from "socket.io-client";
export const socket = io('socket.prosper-media.ml')
export const SocketContext = createContext();