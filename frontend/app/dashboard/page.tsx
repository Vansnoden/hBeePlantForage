'use client';

import { useState, useEffect, use } from 'react';
import BarChart from "../ui/dashboard/charts/barchart";
import CardWrapper from "../ui/dashboard/card";
import { lusitana } from "../ui/fonts";
import { getDashboardData, getPlantTopX, getRegionObsDistro } from "../lib/client_actions";
import DataTable from "../ui/dashboard/table";
import Search from "../ui/dashboard/search";
import PieChart from "../ui/dashboard/charts/piechart";

// Note: 'dynamic' is a server-side config. 
// In a pure client component, we handle "dynamic" behavior via standard React state.

export default function Dashboard(props: {
    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
}) {  
    // Unwrap the searchParams promise using 'use' hook (React 19/Next 15)
    const searchParams = use(props.searchParams!);
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    // State for your data
    const [dashData, setDashData] = useState<any>(null);
    const [plantTop, setPlantTop] = useState<any>([]);
    const [regionObsDistro, setRegionObsDistro] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                // Fetching in parallel for speed
                const [data, top, distro] = await Promise.all([
                    getDashboardData(""),
                    getPlantTopX('', '', 10),
                    getRegionObsDistro('', '', 2005, 2025)
                ]);
                
                setDashData(data);
                setPlantTop(top);
                setRegionObsDistro(distro);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []); // Runs once on mount

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapper total_plants={dashData?.total_plants} total_sites={dashData?.total_sites}/>
            </div>
            <div className="py-3 mt-3 grid gap-6 sm:grid-cols-1 md:grid-cols-4">
                <div>
                    <h2 className={`${lusitana.className} mb-2`}>
                        Quick Stats
                    </h2>
                    <div>
                        <BarChart data={plantTop} show_labels={false}/>
                    </div>
                    <div>
                        <PieChart data={regionObsDistro} width={300} show_labels={false} />
                    </div>
                </div>
                <div className="sm:col-span-4 md:col-span-3">
                    <Search placeholder="Search ..." />
                    <DataTable query={query} currentPage={currentPage}/>
                </div>
            </div> 
        </div>
    );
}