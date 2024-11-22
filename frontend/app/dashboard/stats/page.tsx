import LineChart from "@/app/ui/dashboard/charts/linechart";
import PieChart from "@/app/ui/dashboard/charts/piechart";
import PolarAreaChart from "@/app/ui/dashboard/charts/polarareachart";

export default function Stats(){
    return (
        <div>
            {/* <h1>Satistics page</h1> */}
            <div className="grid grid-cols-2 gap-2">
                <LineChart/>
                <PieChart/>
                <PolarAreaChart/>
                <LineChart/>
            </div>
        </div>
    )
}