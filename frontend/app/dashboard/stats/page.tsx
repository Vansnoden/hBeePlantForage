import { getToken } from '@/app/lib/actions'
import StatsComponent from '@/app/ui/dashboard/statsComponent'
import { cookies } from 'next/headers'


export default async function StatsPage() {
    // Server-side: based on HTTP resquest cookie only
    const token = await getToken() as string;
    return <StatsComponent token={token} />
}