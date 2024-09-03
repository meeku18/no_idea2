import Stream from "../components/Stream";
const CREATOR_ID = "d7a5f7ac-ea7b-49f2-8bc1-dcfd4d2d82af";

export default function dashboard(){
    return <Stream CREATOR_ID={CREATOR_ID} playVideo={true} >
    </Stream>
}