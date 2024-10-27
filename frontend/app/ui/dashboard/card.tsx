import {
    BanknotesIcon,
    UserGroupIcon,
    ArrowUpIcon,
    ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '../fonts.ts';

const iconMap = {
    collected: UserGroupIcon,
    customers: ArrowUpIcon,
    pending: BanknotesIcon,
    invoices: ArrowDownIcon,
};
  

export function Card({
    title,
    value, 
    type
} : {
    title: string;
    value: number | string;
    type: 'invoices' | 'customers' | 'pending' | 'collected';
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

export default async function CardWrapper() {
    const numberOfInvoices = 50;
    const numberOfCustomers = 160;
    const totalPaidInvoices = 90;
    const totalPendingInvoices= 22;
    
    return (
      <>
        {/* NOTE: Uncomment this code in Chapter 9 */}
  
        <Card title="Total Plant Species" value={totalPaidInvoices} type="collected" />
        <Card title="Total Recorded Sites" value={totalPendingInvoices} type="pending" />
        <Card title="Total Downloads" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Uploads"
          value={numberOfCustomers}
          type="customers"
        />
      </>
    );
  }