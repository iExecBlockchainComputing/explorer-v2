import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PaginatedNavigation } from '@/components/PaginatedNavigation.tsx';
import { DataTable } from '../../../components/data-table';
import { appsQuery } from '../appsQuery';
import { App, columns } from './columns.tsx';

function useAppsData(): App[] {
  const { data } = useQuery({
    queryKey: ['apps_preview'],
    queryFn: () => execute(appsQuery, { length: TABLE_LENGTH, skip: 0 }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  return (
    data?.apps.map((app) => ({
      ...app,
      destination: `/apps/${app.address}`,
    })) ?? []
  );
}

export default function AppsTable() {
  const data = useAppsData();
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <>
      <DataTable columns={columns} data={data} />;
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + 2}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
