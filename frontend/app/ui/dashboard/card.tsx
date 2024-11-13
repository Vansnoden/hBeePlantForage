import {
    MapPinIcon,
    CircleStackIcon,
    ArrowDownIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '../fonts';
import { useActionState } from 'react';
import { DashboardData } from '@/app/lib/definitions';

const iconMap = {
    plants: CircleStackIcon,
    sites: MapPinIcon,
    uploads: ArrowUpIcon,
    downloads: ArrowDownIcon,
};
  

export function Card({
    title,
    value, 
    type
} : {
    title: string;
    value: number | string;
    type: 'plants' | 'sites' | 'uploads' | 'downloads';
}){
    const Icon = iconMap[type];
    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            <p className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}>
                {value}
            </p>
        </div>
    )
}

export default async function CardWrapper(props: { total_plants: number; total_sites: number }) {
    const numberOfDowloads = 0
    const numberOfUploads = 0;
    
    return (
      <div>
        <Card title="Total Plant Species" value={props.total_plants} type="plants" />
        <Card title="Total Recorded Sites" value={props.total_sites} type="sites" />
        <Card title="Total Downloads" value={numberOfDowloads} type="downloads" />
        <Card title="Total Uploads" value={numberOfUploads} type="uploads"/>
      </div>
    );
  }