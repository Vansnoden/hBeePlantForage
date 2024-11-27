

export interface CustomChartDataset {
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
    top_10_plants: CustomChartData;
    obs_montly_distro: CustomChartData;
    obs_10_year_overview: CustomChartData;
    sites_per_country: CustomChartData;
}

export interface PlantDataRow{
    id: number,
    country: string;
    site_name: string;
    plant_name: string;
    scientific_name: string;
    family: string;
    taxon: string;
    kingdom: string
}


export interface PlantData{
    total_pages: number,
    page: number,
    data: Array<PlantDataRow> 
}


export interface Observation{
    site_id: number,
    plant_specie_id: number,
    source: string,
    date: string,
    year: number,
    month: number,
    lat: number,
    lon: number
}