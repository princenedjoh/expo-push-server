import { Router } from "express";
import { start } from '../utils/start';

export const notif = Router()

notif.get('/start', start)