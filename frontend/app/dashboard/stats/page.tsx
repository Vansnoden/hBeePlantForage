import { getDashboardData } from "@/app/lib/actions";
import BarChart from "@/app/ui/dashboard/charts/barchart";
import LineChart from "@/app/ui/dashboard/charts/linechart";
import PieChart from "@/app/ui/dashboard/charts/piechart";
import PolarAreaChart from "@/app/ui/dashboard/charts/polarareachart";

export default async function Stats(){
    const dashData = await getDashboardData();
    return (
        <div>
            {/* <h1>Satistics page</h1> */}
            <div className="grid grid-cols-2 gap-4">
                <BarChart data={dashData?.top_10_plants} show_labels={true}/>
                <BarChart data={dashData?.obs_montly_distro} show_labels={true}/>
                <BarChart data={dashData?.obs_10_year_overview} show_labels={true}/>
                {/* <BarChart data={dashData?.sites_per_country} show_labels={true}/> */}
                {/* <LineChart/>
                <PieChart/>
                <PolarAreaChart/>
                <LineChart/> */}
            </div>
        </div>
    )
}