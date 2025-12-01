import RoomCanvas from "@/app/components/RoomCanvas"


export default async function CanvasPage({ params }: { params: { roomID: string } }){
     const param = (await params).roomID
    

     return <RoomCanvas roomId={param}/>

}