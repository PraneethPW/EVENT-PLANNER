import express, { Request, Response, NextFunction } from "express";
import { body, validationResult, query, param } from "express-validator";
import mongoose from "mongoose";
import Event from "../models/eventModel";

const router = express.Router();


const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("date").isISO8601().withMessage("Date must be valid ISO 8601 string"),
    body("maxParticipants")
      .isInt({ gt: 0 })
      .withMessage("maxParticipants must be a positive integer"),
    body("latitude").optional().isFloat({ min: -90, max: 90 }).withMessage("Latitude must be between -90 and 90"),
    body("longitude").optional().isFloat({ min: -180, max: 180 }).withMessage("Longitude must be between -180 and 180"),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, location, date, maxParticipants, latitude, longitude } = req.body;

      const newEvent = new Event({
        title,
        description,
        location,
        date,
        maxParticipants,
        currentParticipants: 0,
        latitude,
        longitude,
      });
      const saved = await newEvent.save();
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  }
);


router.get(
  "/",
  [
    query("location").optional().isString(),
    query("lat").optional().isFloat({ min: -90, max: 90 }),
    query("lng").optional().isFloat({ min: -180, max: 180 }),
    query("radiusKm").optional().isFloat({ min: 0 }),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { location, lat, lng, radiusKm } = req.query;
      let query: any = {};
      if (location && typeof location === "string") {
        query.location = { $regex: location, $options: "i" };
      }

      let events = await Event.find(query);

      if (lat && lng && radiusKm) {
        const latNum = parseFloat(lat as string);
        const lngNum = parseFloat(lng as string);
        const radius = parseFloat(radiusKm as string);

        const haversineDistanceKm = (
          lat1: number,
          lon1: number,
          lat2: number,
          lon2: number
        ) => {
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) ** 2;
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        events = events.filter((e: any) => {
          if (!e.latitude || !e.longitude) return false;
          return haversineDistanceKm(latNum, lngNum, e.latitude, e.longitude) <= radius;
        });
      }

      res.json(events);
    } catch (err) {
      next(err);
    }
  }
);


router.get(
  "/:id",
  [
    param("id")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid event ID"),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json(event);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
