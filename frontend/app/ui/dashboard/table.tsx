
import { getPlantData } from '@/app/lib/actions';
import { PlantData, PlantDataRow } from '@/app/lib/definitions';


// DataTable.use(DT);

export default async function CDataTable() {
  const plant_data_rows: PlantData = await getPlantData();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
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