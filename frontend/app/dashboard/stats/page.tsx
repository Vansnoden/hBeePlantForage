import { getDashboardData, getFamilyData } from "@/app/lib/actions";
import BarChart from "@/app/ui/dashboard/charts/barchart";
// import LineChart from "@/app/ui/dashboard/charts/linechart";
import PieChart from "@/app/ui/dashboard/charts/piechart";
import MiniMapComponent from "@/app/ui/dashboard/mini_map";
import { lusitana } from "@/app/ui/fonts";

// import PolarAreaChart from "@/app/ui/dashboard/charts/polarareachart";

export default async function Stats(){
    const dashData = await getDashboardData();
    const geojsonObject = await getFamilyData("Acanthaceae");

    return (
        <div>
            {/* <h1>Satistics page</h1> */}
            <div className="">
                <div className="card mb-2 bg-yellow-600 rounded flex gap-2 p-2">
                    <div className={`${lusitana.className} relative`}>
                        <span>Country distribution of plant specie family</span>
                        <select
                            id="family"
                            name="family_id"
                            defaultValue="Acanthaceae"
                            className="block w-full cursor-pointer rounded-md border py-2 border-gray-200 bg-white text-sm outline-2 placeholder:text-gray-500"
                            >
                            <option value="Acanthaceae">
                                Acanthaceae
                            </option>
                            <option value="Bignoniaceae">
                                Bignoniaceae
                            </option>
                            <option value="Aceraceae">
                                Aceraceae
                            </option>
                            <option value="Achariaceae">
                                Achariaceae
                            </option>
                            <option value="Agavaceae">
                                Agavaceae
                            </option>
                            {/* other options */}
                        </select>
                    </div>
                </div>
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