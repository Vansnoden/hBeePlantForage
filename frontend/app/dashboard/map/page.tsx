
// import { getToken } from "@/app/lib/actions";
import MapComponent from "@/app/ui/dashboard/map";
import { useSession } from "next-auth/react";

export default function Map(){

    // const token = await getToken() as string;
    const { data: session, status } = useSession();
    console.log(status);
    return <MapComponent token={(session?.user as any).accessToken}/>  // eslint-disable-line
}