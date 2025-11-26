import Canvas from "@/app/components/Canvas"
import RoomCanvas from "@/app/components/RoomCanvas"


export default async function CanvasPage({ params }: { params: { roomID: string } }){
     console.log("hello")
     const param = (await params).roomID
     console.log(param)

     return <RoomCanvas roomId={param}/>

}