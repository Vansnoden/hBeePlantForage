import { getDashboardData, getFamilyData } from "@/app/lib/actions";
import BarChart from "@/app/ui/dashboard/charts/barchart";
// import LineChart from "@/app/ui/dashboard/charts/linechart";
import PieChart from "@/app/ui/dashboard/charts/piechart";
import MiniMapComponent from "@/app/ui/dashboard/mini_map";
// import PolarAreaChart from "@/app/ui/dashboard/charts/polarareachart";

export default async function Stats(){
    const dashData = await getDashboardData();
    const geojsonObject = await getFamilyData("Acanthaceae");
    return (
        <div>
            {/* <h1>Satistics page</h1> */}
            <div className="">
                <MiniMapComponent geojsonObject={geojsonObject}/>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
                <BarChart data={dashData?.sites_per_country} show_labels={true}/>
                <BarChart data={dashData?.top_10_plants} show_labels={true}/>
                <BarChart data={dashData?.obs_montly_distro} show_labels={true}/>
                <BarChart data={dashData?.obs_10_year_overview} show_labels={true}/>
                <PieChart data={dashData?.obs_per_region} show_labels={true} />
            </div>
        </div>
    )
}