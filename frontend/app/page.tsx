import Link from "next/link";
import { Button } from "./ui/button";
import { lusitana } from "./ui/fonts";
import Image from "next/image";
import { ArrowRightIcon } from '@heroicons/react/20/solid';


export default async function HomePage(){ 
    return(
        <div className="home-bg">
            {/* header */}
            <div className="">
                <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Image src="/icipe_logo.png" alt="icipe logo" width="140" height="40" className="rounded-lg mr-2"></Image>
                            <Image src="/bee-logo.svg" className="h-8" width="140" height="40" alt="Flowbite Logo"></Image>
                            <span className="flex flex-col">
                                <span className="self-left text-sm font-semibold whitespace-nowrap dark:text-white">Honey Bee Forage</span><br/>
                                <span className="self-left text-sm font-semibold whitespace-nowrap dark:text-white">Plants Dashboard</span>
                            </span>
                        </Link>
                        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            <Link href="/dashboard">
                                <Button> 
                                    Go to Dashboard
                                    <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
            {/* content */}
            <div className="mx-auto mt-5 flex flex-col items-center justify-center">
                <div className="p-0 home-banner flex justify-start align-middle items-center">
                    <div className="max-w-screen-xl b-text mx-auto mt-14">
                        Overview of the distribution of honey bee forage plant species in Africa
                    </div>
                    <div className="bannerOverlay"></div>
                </div>
                
                <div className="py-10">
                    <div className="max-w-screen-xl bg-white p-4 rounded-md">
                        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                            Welcome to the African Honey Bee Forage Plants Dashboard
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div>
                                <Image src="/bg_home.jpg" alt="Banner image" width="600" height="500" className="rounded-lg shadow-2xl"></Image>
                            </div>
                            <div className={`${lusitana.className} mt-4 mb-4 text-wrap text-justify`}>
                                This interactive tool, developed by the International Centre of Insect Physiology and Ecology 
                                (icipe) in Nairobi, Kenya, provides detailed information on honey bee forage plants identified 
                                across Africa. By mapping their global geospatial distribution, the dashboard helps researchers, 
                                conservationists, and land managers identify key forage plants that support honey bee nutrition 
                                in different African regions and beyond. It also highlights gaps in species occurrence in Africa, 
                                guiding future research and conservation efforts to improve data coverage and enhance plant-pollinator 
                                management strategies. Expanding field surveys and updating species records will be crucial for filling 
                                these gaps and strengthening the database. Please note that the database is still under development, 
                                and some plant species may not yet be included.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* footer */}
            <div  className="bg-white w-full border-b border-gray-200 dark:border-gray-600 mt-5 py-4 flex justify-center items-center">
                <Image src="/icipe_logo.png" alt="icipe logo" width="120" height="20" className="rounded-lg mr-2"></Image>
                <Image src="/bee-logo.svg" width="120" height="20" className="h-8 mr-2" alt="Flowbite Logo"></Image>
                <span>Copyright bppd@2025</span>
            </div>
        </div>
    )
}