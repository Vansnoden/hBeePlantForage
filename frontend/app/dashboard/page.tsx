import LineChart from "../ui/dashboard/charts/linechart";
import BarChart from "../ui/dashboard/charts/barchart";
import PieChart from "../ui/dashboard/charts/piechart";
import CardWrapper from "../ui/dashboard/card";
import { lusitana } from "../ui/fonts";
import PolarAreaChart from "../ui/dashboard/charts/polarareachart";


export default async function Dashboard(){  
    return(
        <div>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapper />
            </div>
            <div className="p-3 mt-3 grid gap-6 grid-cols-2">
                <LineChart/>
                <BarChart/>
                <PieChart/>
                <PolarAreaChart/>
            </div> 
        </div>
    )
}