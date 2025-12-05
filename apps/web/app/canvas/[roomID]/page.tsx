import RoomCanvas from "@/app/components/RoomCanvas";


type PageProps = {
     params: Promise<{ roomID: string }>;
   };
   
   export default async function Page({ params }: PageProps) {
     const { roomID } = await params;
     
     return (
       <div>
         <RoomCanvas roomId={roomID} />
       </div>
     );
   }