
export interface CustomChartDataset{
    label: string;
    data: Array<number>;
    backgroundColor: Array<string>;
    borderColor: Array<string>;
    borderWidth: number
}

export interface CustomChartData{
    labels: Array<string>;
    datasets: CustomChartDataset;
}


export interface DashboardData{
    total_plants: number;
    total_sites: number;
    sites_per_country: CustomChartData;
}