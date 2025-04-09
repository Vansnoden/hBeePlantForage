// import { useSession } from 'next-auth/react';
import { getToken } from '../../lib/actions'
import StatsComponent from '../../ui/dashboard/statsComponent'


export default async function StatsPage() {
    // Server-side: based on HTTP resquest cookie only
    // const { data: session, status } = useSession();
    // const token = await getToken() as string;
    // console.log(status);
    // return <StatsComponent token={(session?.user as any).accessToken} /> // eslint-disable-line
    return <StatsComponent/> 
}