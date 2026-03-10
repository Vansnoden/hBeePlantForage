/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { getPlantData } from '@/app/lib/client_actions';
import { PlantData } from '@/app/lib/definitions';
import Pagination from './pagination';
import { lusitana } from '../fonts';

export default function DataTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // 1. Initialize state with a structure matching your PlantData definition
  const [plantDataRows, setPlantDataRows] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data whenever query or currentPage changes
  useEffect(() => {
    async function loadTableData() {
      setLoading(true);
      try {
        const data = await getPlantData(query, currentPage);
        setPlantDataRows(data);
      } catch (error) {
        console.error("Error fetching plant data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTableData();
  }, [query, currentPage]); // Dependency array: re-run when these change

  // 3. Handle loading state
  if (loading && !plantDataRows) {
    return <div className="mt-6 text-center">Loading table data...</div>;
  }

  const totalPages = plantDataRows?.total_pages || 0;

  return (
    <div className={`${lusitana.className} mt-6 flow-root`}>  
      <div className="inline-block min-w-full align-middle">
        <div className={`rounded-lg bg-gray-50 p-2 md:pt-0 table-container ${loading ? 'opacity-50' : ''}`}>
          <table className="hidden min-w-full text-gray-900 md:table table-auto">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 ">Country</th>
                <th scope="col" className="px-3 py-5 font-medium">Site Name</th>
                <th scope="col" className="px-3 py-5 font-medium">Plant Name</th>
                <th scope="col" className="px-3 py-5 font-medium">Family</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {plantDataRows?.data?.map((plant_data) => (
                <tr
                  key={plant_data.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none"
                >
                    <td className="px-3 py-3 break-all">{plant_data.country}</td>
                    <td className="px-3 py-3 break-all">{plant_data.site_name}</td>
                    <td className="whitespace-nowrap px-3 py-3 break-all">{plant_data.plant_name}</td>
                    <td className="whitespace-nowrap px-3 py-3 break-all">{plant_data.family}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {plantDataRows?.data?.length === 0 && !loading && (
            <p className="text-center py-4">No results found.</p>
          )}
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}