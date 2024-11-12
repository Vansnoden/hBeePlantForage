import { PlantDataRow } from '@/app/lib/definitions';
import Image from 'next/image';

// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
// import InvoiceStatus from '@/app/ui/invoices/status';
// import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
// import { fetchFilteredInvoices } from '@/app/lib/data';

export default async function DataTable() {
  const plant_data_rows: Array<PlantDataRow> = [];

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {plant_data_rows?.map((plant_data) => (
                <tr
                  key={plant_data.site_name}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                    <td className="whitespace-nowrap px-3 py-3">
                        {plant_data.country}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                        {plant_data.site_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                        {plant_data.plant_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                        {plant_data.scientific_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                        {plant_data.family}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                        {plant_data.taxon}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                        {plant_data.kingdom}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}