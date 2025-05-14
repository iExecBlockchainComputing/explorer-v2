import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PaginatedNavigation } from '@/components/PaginatedNavigation.tsx';
import { DataTable } from '../../../components/DataTable.tsx';
import { appsQuery } from '../appsQuery';
import { App, columns } from './columns.tsx';

function useAppsData(currentPage: number): App[] {
  const skip = currentPage * TABLE_LENGTH;

  const { data } = useQuery({
    queryKey: ['apps', currentPage],
    queryFn: () => execute(appsQuery, { length: TABLE_LENGTH, skip }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
    placeholderData: keepPreviousData,
  });

  return (
    data?.apps.map((app) => ({
      ...app,
      destination: `/apps/${app.address}`,
    })) ?? []
  );
}

export default function AppsTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const data = useAppsData(currentPage);

  return (
    <>
      <DataTable columns={columns} data={data} />
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + 2}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
