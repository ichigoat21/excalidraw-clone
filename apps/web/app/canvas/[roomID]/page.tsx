import RoomCanvas from "@/app/components/RoomCanvas";

export default async function Page({
     params,
   }: {
     params: { roomID: string } | Promise<{ roomID: string }>;
   }) {
     const resolved = await params;
     const roomID = resolved.roomID;
   
     return <RoomCanvas roomId={roomID} />;
   }
   