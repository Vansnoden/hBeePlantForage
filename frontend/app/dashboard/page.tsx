import LineChart from "../ui/dashboard/charts/linechart";
import BarChart from "../ui/dashboard/charts/barchart";
import PieChart from "../ui/dashboard/charts/piechart";
import CardWrapper from "../ui/dashboard/card";
import { lusitana } from "../ui/fonts";
import PolarAreaChart from "../ui/dashboard/charts/polarareachart";
import { getDashboardData } from "../lib/actions";



export default async function Dashboard(){  
    const dashData = await getDashboardData()
    return(
        <div>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapper total_plants={dashData.total_plants} total_sites={dashData.total_sites}/>
            </div>
            <div className="p-3 mt-3 grid gap-2 grid-cols-2">
                {/* <LineChart/> */}
                <BarChart data={dashData.sites_per_country}/>
                {/* <PieChart/> */}
                {/* <PolarAreaChart/> */}
            </div> 
        </div>
    )
}