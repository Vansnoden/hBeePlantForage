
import { getPlantData } from '@/app/lib/actions';
import { PlantData, PlantDataRow } from '@/app/lib/definitions';
import Pagination from './pagination';


// DataTable.use(DT);

export default async function DataTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const plant_data_rows: PlantData = await getPlantData(query, currentPage);
  const totalPages = plant_data_rows.total_pages;

  return (
    <div className="mt-6 flow-root">  
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table table-auto">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 ">
                  Country
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Site Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Plant Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Scientific Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Family
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Taxon
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Kingdom
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {plant_data_rows.data?.map((plant_data) => (
                <tr
                  key={plant_data.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                    <td className="px-3 py-3 break-all">
                        {plant_data.country}
                    </td>
                    <td className="px-3 py-3 break-all">
                        {plant_data.site_name}
                    </td>
                    <td className="px-3 py-3 break-all">
                        {plant_data.plant_name}
                    </td>
                    <td className="px-3 py-3 break-all">
                        {plant_data.scientific_name}
                    </td>
                    <td className="px-3 py-3 break-all">
                        {plant_data.family}
                    </td>
                    <td className="px-3 py-3 break-all">
                        {plant_data.taxon}
                    </td>
                    <td className="px-3 py-3 break-all">
                        {plant_data.kingdom}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}