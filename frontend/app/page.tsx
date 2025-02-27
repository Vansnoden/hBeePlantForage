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
                        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="/bee-logo.svg" className="h-8" alt="Flowbite Logo"/>
                            <span className="flex flex-col">
                                <span className="self-left text-sm font-semibold whitespace-nowrap dark:text-white">Bee Plant</span><br/>
                                <span className="self-left text-sm font-semibold whitespace-nowrap dark:text-white">Preference Dashboard</span>
                            </span>
                        </a>
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
                        Overview of the distribution of key bee 
                        pollinators plants species in Africa and beyond
                    </div>
                    <div className="bannerOverlay"></div>
                </div>
                
                <div className="py-10">
                    <div className="max-w-screen-xl bg-white p-4 rounded-md">
                        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                            Welcome to the Bee Plant Preference Dashboard
                        </h1>
                        <div className="grid gap-6 grid-cols-2">
                            <div>
                                <Image src="/bg_home.jpg" alt="Banner image" width="600" height="500" className="rounded-lg shadow-2xl"></Image>
                            </div>
                            <div className={`${lusitana.className} mt-4 mb-4 text-wrap`}>
                                This platform offers a deep dive into the floral preferences of different bee species, 
                                providing valuable insights into which plants they favor most. By analyzing extensive 
                                data on plant-bee interactions, it helps researchers, conservationists, and enthusiasts 
                                understand the crucial role of specific flowers in supporting pollinator populations. 
                                Whether you're studying native bee species, tracking seasonal foraging patterns, or 
                                identifying key plants for pollinator-friendly gardens, this resource enables a detailed 
                                exploration of these ecological relationships.
                                With interactive data visualizations and in-depth analyses, users can uncover trends 
                                that inform conservation strategies and habitat restoration efforts. By highlighting 
                                the plants that attract and sustain diverse bee populations, the tool aids in fostering 
                                environments where pollinators can thrive. Whether used for scientific research or 
                                practical land management, this platform serves as a bridge between ecological data 
                                and real-world applications, ultimately contributing to the protection of pollinators 
                                and the ecosystems they support.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* footer */}
            <div  className="bg-white w-full border-b border-gray-200 dark:border-gray-600 mt-5 py-4 flex justify-center items-center">
                <span>Copyright bppd@2025</span>
            </div>
        </div>
    )
}