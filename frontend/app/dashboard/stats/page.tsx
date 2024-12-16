import { getToken } from '../../lib/actions'
import StatsComponent from '../../ui/dashboard/statsComponent'


export default async function StatsPage() {
    // Server-side: based on HTTP resquest cookie only
    const token = await getToken() as string;
    return <StatsComponent token={token} />
}