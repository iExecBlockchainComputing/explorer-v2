import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '../../../components/data-table';
import { appsQuery } from '../appsQuery';
import { App, columns } from './columns';

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

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
