

import CanvasPage from "@/app/components/Canvas";

export default async function Canvas({params} : {
    params : {
        roomId : string
    }
}){ 
    const roomId = await params.roomId
    console.log(roomId)
    return <CanvasPage roomId={roomId}/>
}