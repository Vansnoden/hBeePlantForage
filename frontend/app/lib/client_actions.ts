"use client";

import { FAMILY_DATA_MAX_URL, FAMILY_DATA_URL, FAMILY_NAME_SEARCH, PLANT_DATA_URL, PLANT_TOP_URL, REGION_DISTRO_URL, YEAR_DISTRO_URL } from './constants';
import { DASHBOARD_DATA_URL } from "./constants";
import { CustomChartData, DashboardData, PlantData } from './definitions';


export async function getDashboardData(token: string, fname: string){
    const dashData = await fetch(DASHBOARD_DATA_URL +"?fname="+fname, {
        method: 'GET',
        headers: {
            "Authorization": token
        }
    }).then((res) => res.json())
    return dashData as DashboardData;
}


export async function getPlantTopX(token: string, fname: string, limit:number){
    const dashData = await fetch(PLANT_TOP_URL +"?fname="+fname+"&top="+limit, {
        method: 'GET',
        headers: {
          "Authorization": token
        }
    }).then((res) => res.json())
    return dashData?.data as CustomChartData;
}
  

export async function getRegionObsDistro(token: string, cname: string){
    const dashData = await fetch(REGION_DISTRO_URL +"?cname="+cname, {
        method: 'GET',
        headers: {
          "Authorization": token
        }
    }).then((res) => res.json())
    return dashData?.data as CustomChartData;
}


export async function getYearlyObsDistro(token: string, cname: string, yearStart:number, yearEnd:number){
    const dashData = await fetch(YEAR_DISTRO_URL +"?cname="+cname+"&year_start="+yearStart+"&year_end="+yearEnd, {
        method: 'GET',
        headers: {
          "Authorization": token
        }
    }).then((res) => res.json())
    return dashData?.data as CustomChartData;
}



export async function getPlantData(token: string, query: string, currentPage: number){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };
    const plant_data = await fetch(PLANT_DATA_URL +"?query="+query+"&page="+currentPage, requestOptions)
    .then((response) => response.json())
    return plant_data as PlantData;
}


export async function getFamilyData(token: string, fname: string){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };
    const data = await fetch(FAMILY_DATA_URL +"?fname="+fname, requestOptions)
    .then((response) => response.json());
    return data;
}


export async function getFamilyDataMax(token: string, fname: string){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    const requestOptions = { method: "GET", headers: myHeaders };
    const data = await fetch(FAMILY_DATA_MAX_URL +"?fname="+fname, requestOptions)
    .then((response) => response.json());
    return data; 
}


export async function searchFamilyNames(token: string, search_string: string){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };
    const data:Array<string> = await fetch(FAMILY_NAME_SEARCH + `?search_string=${search_string}`, requestOptions)
    .then((response) => response.json());
    return data; 
}