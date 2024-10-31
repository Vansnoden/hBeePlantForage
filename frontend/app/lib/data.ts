import { getToken } from "./actions";
import { DASHBOARD_DATA_URL } from "./constants";


export async function getDashboardData(){
    const token = await getToken() as string
    const dashData = await fetch(DASHBOARD_DATA_URL, {
        method: 'GET',
        headers: {
            "Authorization": token
        }
    }).then((res) => res.json())
    return dashData;
}