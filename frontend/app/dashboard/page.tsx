import LineChart from "../ui/dashboard/charts/linechart";
import BarChart from "../ui/dashboard/charts/barchart";
import PieChart from "../ui/dashboard/charts/piechart";
import CardWrapper from "../ui/dashboard/card";
import { lusitana } from "../ui/fonts";
import PolarAreaChart from "../ui/dashboard/charts/polarareachart";
import { getDashboardData } from "../lib/actions";
import DataTable from "../ui/dashboard/table";



export default async function Dashboard(){  
    const dashData = await getDashboardData()
    return(
        <div>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapper total_plants={dashData?.total_plants} total_sites={dashData?.total_sites}/>
            </div>
            <div className="p-3 mt-3 grid gap-6 grid-cols-4">
                <div>
                    <h2 className={`${lusitana.className} mb-2`}>
                        Quick Stats
                    </h2>
                    <BarChart data={dashData?.sites_per_country}/>
                    {/* <LineChart/> */}
                    {/* <PieChart/> */}
                    {/* <PolarAreaChart/> */}
                </div>
                <div className="md:col-span-3 sm:col-span-1">
                    <DataTable/>
                </div>
            </div> 
        </div>
    )
}