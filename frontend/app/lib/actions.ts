'use server'

import { AuthError } from 'next-auth';
import { FAMILY_DATA_MAX_URL, FAMILY_DATA_URL, FAMILY_NAME_SEARCH, PLANT_DATA_URL } from './constants';
import { cookies } from 'next/headers'
import { signIn } from '../../auth';
import { DASHBOARD_DATA_URL } from "./constants";
import { DashboardData, PlantData } from './definitions';

export type State = {
    errors?: {
      status?: string[];
    };
    message?: string | null;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function getToken(){
  const cookieStore = await cookies()
  const base_token = cookieStore.get('auth-token')
  const token = base_token?.value.split("__").join(" ")
  return token
}


export async function getDashboardData(fname: string){
  const token = await getToken() as string
  const dashData = await fetch(DASHBOARD_DATA_URL +"?fname="+fname, {
      method: 'GET',
      headers: {
          "Authorization": token
      }
  }).then((res) => res.json())
  return dashData as DashboardData;
}

export async function getPlantData(query: string, currentPage: number){
  const token = await getToken() as string
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const plant_data = await fetch(PLANT_DATA_URL +"?query="+query+"&page="+currentPage, 
    requestOptions).then((response) => response.json())
 
  return plant_data as PlantData;
}


export async function getFamilyData(fname: string){
  const token = await getToken() as string
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const data = await fetch(FAMILY_DATA_URL +"?fname="+fname, 
    requestOptions).then((response) => response.json())
 
  return data;
}


export async function getFamilyDataMax(fname: string){
  const token = await getToken() as string
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const data = await fetch(FAMILY_DATA_MAX_URL +"?fname="+fname, 
    requestOptions).then((response) => response.json())
 
  return data; 
}


export async function getAllFamilyNames(){
  const token = await getToken() as string
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const data = await fetch(FAMILY_NAME_SEARCH, 
    requestOptions).then((response) => response.json())
 
  return data; 
}