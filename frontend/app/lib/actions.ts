'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { AUTH_URL } from './constants.ts';


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
        await fetch(AUTH_URL, formData);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}