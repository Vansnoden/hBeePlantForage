'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { AUTH_URL, PLANT_DATA_URL } from './constants';
import { cookies } from 'next/headers'
import { signIn } from '../../auth';
import { DASHBOARD_DATA_URL } from "./constants";
import { number } from 'zod';
import { DashboardData, PlantData, PlantDataRow } from './definitions';

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
  console.log("TOKEN: " + token)
  return token
}


export async function getDashboardData(){
  const token = await getToken() as string
  const dashData = await fetch(DASHBOARD_DATA_URL, {
      method: 'GET',
      headers: {
          "Authorization": token
      }
  }).then((res) => res.json())
  return dashData as DashboardData;
}

export async function getPlantData(page=1){
  const token = await getToken() as string
  const plantData = await fetch(PLANT_DATA_URL, {
      method: 'POST',
      headers: {
          "Authorization": token
      },
      body:{
        page: page
      }
  }).then((res) => res.json())
  return plantData as PlantData;
}