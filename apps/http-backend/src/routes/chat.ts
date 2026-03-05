import { roomSchema } from "@repo/common/z";
import express, { Router } from "express";
import { client } from "@repo/db-package/client";

const roomRouter: Router = express.Router();

// Valid shape types — extend here if new tools are added
const VALID_SHAPE_TYPES = new Set(["rect", "circle", "pencil", "line"]);

/** Validates that a message string is valid JSON containing a known shape type.
 *  Returns the parsed object on success, null if invalid. */
function parseShapeMessage(raw: string): object | null {
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.shape !== "object" ||
      parsed.shape === null ||
      !VALID_SHAPE_TYPES.has(parsed.shape.type)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// GET /rooms — fetch all rooms owned by the authenticated user
roomRouter.get("/rooms", async (req, res) => {
  try {
    const userId = (req as any).id;

    if (typeof userId !== "string") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const rooms = await client.room.findMany({
      where: { adminId: userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, slug: true, createdAt: true },
    });

    res.status(200).json({ rooms });
  } catch {
    res.status(500).json({ message: "Error fetching rooms" });
  }
});

// POST /chat — create a new room
roomRouter.post("/chat", async (req, res) => {
  try {
    const parsedData = roomSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({ message: "Invalid inputs" });
      return;
    }

    const userId = (req as any).id;

    if (typeof userId !== "string") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const room = await client.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.status(200).json({ roomId: room.id });
  } catch (e: any) {
    // Unique constraint on slug
    if (e?.code === "P2002") {
      res.status(409).json({ message: "A room with that name already exists" });
      return;
    }
    res.status(500).json({ message: "Error creating room" });
  }
});

// GET /chat/:id — fetch last 50 messages for a room, filtering out malformed shapes
roomRouter.get("/chat/:id", async (req, res) => {
  try {
    const roomId = Number(req.params.id);

    if (isNaN(roomId)) {
      res.status(400).json({ message: "Invalid room ID" });
      return;
    }

    const rawMessages = await client.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 50,
    });

    // Filter to only well-formed shape messages so unknown/corrupt
    // entries from old or future shape types never crash the canvas
    const messages = rawMessages.filter((m) => parseShapeMessage(m.message) !== null);

    res.status(200).json({ messages });
  } catch {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

export default roomRouter;