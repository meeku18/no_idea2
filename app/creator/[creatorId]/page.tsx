import Stream from "@/app/components/Stream";

export default function creator({ params: {creatorId } }:{ params:{ creatorId:string}} ){
    return <div>
        <Stream CREATOR_ID={creatorId} playVideo={false}></Stream>
    </div>
}