"use client";

import { FAMILY_DATA_MAX_URL, FAMILY_DATA_URL, FAMILY_NAME_ALL, PLANT_DATA_URL } from './constants';
import { DASHBOARD_DATA_URL } from "./constants";
import { DashboardData, PlantData } from './definitions';


export function getDashboardData(token: string, fname: string){
  let dashData = {};
  fetch(DASHBOARD_DATA_URL +"?fname="+fname, {
      method: 'GET',
      headers: {
          "Authorization": token
      }
  }).then((res) => res.json())
  .then((data) => {
    dashData = data;
  })
  return dashData as DashboardData;
}

export function getPlantData(token: string, query: string, currentPage: number){
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  let plant_data = {} 
  fetch(PLANT_DATA_URL +"?query="+query+"&page="+currentPage, requestOptions)
  .then((response) => response.json())
  .then((data) => {
    plant_data = data;
    console.log(plant_data);
  })
 
  return plant_data as PlantData;
}


export function getFamilyData(token: string, fname: string){
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  let data = {} 
  fetch(FAMILY_DATA_URL +"?fname="+fname, requestOptions)
  .then((response) => response.json())
  .then((res) => {
    data = res;
    console.log(res);
  })
 
  return data;
}


export function getFamilyDataMax(token: string, fname: string){
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  let data = 0; 
  fetch(FAMILY_DATA_MAX_URL +"?fname="+fname, requestOptions)
  .then((response) => response.json())
  .then((res)=>{
    data = res;
    console.log(res);
  })
  
  return data; 
}


export function getAllFamilyNames(token: string, ){
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  let data:Array<string> = [];
  fetch(FAMILY_NAME_ALL, requestOptions)
  .then((response) => response.json())
  .then((res) => {
    console.log(res);
    data = res;
  })
 
  return data; 
}