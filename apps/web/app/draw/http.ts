import axios from "axios";
import { HTTP_BACKEND } from "../config";

export async function getExistingShapes(roomId: string, token: string) {
  const res = await axios.get(`${HTTP_BACKEND}/room/chat/${roomId}`, {
    headers: {
      Authorization: token,
    },
  });

  const messages: { message: string }[] = res.data.messages;

  return messages
    .map((x) => {
      try {
        const data = JSON.parse(x.message);
        return data.shape ?? null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}