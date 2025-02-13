import Link from "next/link";
import { Button } from "./ui/button";
import { lusitana } from "./ui/fonts";
import Image from "next/image";
import { ArrowRightIcon } from '@heroicons/react/20/solid';


export default async function HomePage(){ 
    return(
        <div className="h-screen flex items-center justify-center home-bg">
            <div className="md:w-1/3 sm:w-screen bg-yellow-200 p-4 rounded-lg">
                <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                    Welcome to the Bee Plant Preference Dashboard
                </h1>
                <div className="grid gap-6 grid-cols-1">
                    <div>
                        <Image src="/bg_home.jpg" alt="Banner image" width="600" height="500" className="rounded-lg shadow-2xl"></Image>
                    </div>
                    <div className={`${lusitana.className} mt-4 mb-4 text-wrap`}>
                        This tool provides insights into the plants most favored by various 
                        bee species, helping you understand their floral preferences and 
                        interactions within specific ecosystems. Explore comprehensive data 
                        visualizations and analyses to support research, conservation efforts, 
                        and the enhancement of pollinator-friendly habitats.
                    </div>
                    <div>
                        <Link href="/dashboard">
                            <Button> 
                                Go to Dashboard
                                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}