
import { getToken } from "@/app/lib/actions";
import MapComponent from "@/app/ui/dashboard/map";

export default async function Map(){

    const token = await getToken() as string;
    
    return <MapComponent token={token}/>
}