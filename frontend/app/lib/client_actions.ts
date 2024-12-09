"use client";

import { FAMILY_DATA_MAX_URL, FAMILY_DATA_URL, FAMILY_NAME_SEARCH, PLANT_DATA_URL } from './constants';
import { DASHBOARD_DATA_URL } from "./constants";
import { DashboardData, PlantData } from './definitions';


export async function getDashboardData(token: string, fname: string){
  let dashData = await fetch(DASHBOARD_DATA_URL +"?fname="+fname, {
        method: 'GET',
        headers: {
            "Authorization": token
        }
    }).then((res) => res.json())
    return dashData as DashboardData;
}

export async function getPlantData(token: string, query: string, currentPage: number){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };
    let plant_data = await fetch(PLANT_DATA_URL +"?query="+query+"&page="+currentPage, requestOptions)
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
    let data = await fetch(FAMILY_DATA_URL +"?fname="+fname, requestOptions)
    .then((response) => response.json());
    return data;
}


export async function getFamilyDataMax(token: string, fname: string){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    const requestOptions = { method: "GET", headers: myHeaders };
    var data = await fetch(FAMILY_DATA_MAX_URL +"?fname="+fname, requestOptions)
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
    let data:Array<string> = await fetch(FAMILY_NAME_SEARCH + `?search_string=${search_string}`, requestOptions)
    .then((response) => response.json())
    return data; 
}