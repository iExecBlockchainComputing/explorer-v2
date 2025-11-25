import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Tabs } from '@/modules/Tabs';
import { AddressAppsTable } from '@/modules/addresses/address/apps/AddressAppsTable';
import { AddressDatasetsTable } from '@/modules/addresses/address/datasets/AddressDatasetsTable';
import { AddressAppsGrantedAccessTable } from '@/modules/addresses/address/grantedAccess/AddressAppsGrantedAccessTable';
import { AddressDatasetsGrantedAccessTable } from '@/modules/addresses/address/grantedAccess/AddressDatasetsGrantedAccessTable';
import { AddressWorkerpoolsGrantedAccessTable } from '@/modules/addresses/address/grantedAccess/AddressWorkerpoolsGrantedAccessTable';
import { AddressAppsReceivedAccessTable } from '@/modules/addresses/address/receivedAccess/AddressAppsReceivedAccessTable';
import { AddressDatasetsReceivedAccessTable } from '@/modules/addresses/address/receivedAccess/AddressDatasetsReceivedAccessTable';
import { AddressWorkerpoolsReceivedAccessTable } from '@/modules/addresses/address/receivedAccess/AddressWorkerpoolsReceivedAccessTable';
import { AddressBeneficiaryDealsTable } from '@/modules/addresses/address/requests/beneficiaryDeals/AddressBeneficiaryDealsTable';
import { AddressRequestedDealsTable } from '@/modules/addresses/address/requests/requestedDeals/AddressRequestedDealsTable';
import { AddressRequestedTasksTable } from '@/modules/addresses/address/requests/requestedTasks/AddressRequestedTasksTable';
import { AddressWorkerpoolsTable } from '@/modules/addresses/address/workerpools/AddressWorkerpoolsTable';
import { AddressContributionTable } from '@/modules/addresses/address/workers/beneficiaryDeals/addressContributionTable';

// Shape of the address data we depend upon (partial to keep flexible)
interface AddressData {
  allContributions: unknown[];
  allApps: unknown[];
  allDatasets: unknown[];
  allWorkerpools: unknown[];
  score: string;
}

interface AddressTabsContentProps {
  addressAddress: string;
  address: AddressData | undefined;
  addressDetails:
    | Record<string, React.ReactNode | React.ReactNode[]>
    | undefined;
  addressOverview:
    | Record<string, React.ReactNode | React.ReactNode[]>
    | undefined;
  hasPastError: boolean;
  isLoading: boolean;
  currentTab: number;
  setCurrentTab: (tab: number) => void;
}

// Labels kept here to guarantee ordering consistency across reuse sites.
export const ADDRESS_TAB_LABELS = [
  'OVERVIEW',
  'REQUESTS',
  'WORKER',
  'APPS',
  'DATASETS',
  'WORKERPOOLS',
  'RECEIVED ACCESS',
  'GRANTED ACCESS',
];

export function AddressTabsContent({
  addressAddress,
  address,
  addressDetails,
  addressOverview,
  hasPastError,
  isLoading,
  currentTab,
  setCurrentTab,
}: AddressTabsContentProps) {
  const disabledTabs: number[] = [];
  const disabledReasons: Record<number, string> = {};

  const hasAddressData = address !== null; // if undefined we are still loading / placeholder

  // Disable only after load completed & no data for that section.
  if (!isLoading && hasAddressData && !address?.allContributions?.length) {
    disabledTabs.push(2);
    disabledReasons[2] = 'No contributions for this address.';
  }
  if (!isLoading && hasAddressData && !address?.allApps?.length) {
    disabledTabs.push(3);
    disabledReasons[3] = 'No apps for this address.';
  }
  if (!isLoading && hasAddressData && !address?.allDatasets?.length) {
    disabledTabs.push(4);
    disabledReasons[4] = 'No datasets for this address.';
  }
  if (!isLoading && hasAddressData && !address?.allWorkerpools?.length) {
    disabledTabs.push(5);
    disabledReasons[5] = 'No workerpools for this address.';
  }

  return (
    <>
      {hasPastError && !addressOverview ? (
        <ErrorAlert message="An error occurred during address details loading." />
      ) : (
        <DetailsTable details={addressOverview || {}} zebra={false} />
      )}

      <Tabs
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        tabLabels={ADDRESS_TAB_LABELS}
        disabledTabs={disabledTabs}
        disabledReasons={disabledReasons}
      />

      <div>
        {currentTab === 0 &&
          (hasPastError && !addressDetails ? (
            <ErrorAlert message="An error occurred during address details loading." />
          ) : (
            <DetailsTable details={addressDetails || {}} />
          ))}
        {currentTab === 1 && (
          <>
            <AddressRequestedTasksTable addressAddress={addressAddress} />
            <AddressRequestedDealsTable addressAddress={addressAddress} />
            <AddressBeneficiaryDealsTable addressAddress={addressAddress} />
          </>
        )}
        {currentTab === 2 && (
          <>
            <p className="mb-8">
              Contributions : {address?.allContributions.length}
            </p>
            <p className="mb-6">Score : {address?.score}</p>
            <AddressContributionTable addressAddress={addressAddress} />
          </>
        )}
        {currentTab === 3 && (
          <>
            <p className="mb-6">Deployed apps : {address?.allApps.length}</p>
            <AddressAppsTable addressAddress={addressAddress} />
          </>
        )}
        {currentTab === 4 && (
          <>
            <p className="mb-6">
              Deployed datasets : {address?.allDatasets.length}
            </p>
            <AddressDatasetsTable addressAddress={addressAddress} />
          </>
        )}
        {currentTab === 5 && (
          <>
            <p className="mb-6">
              Deployed workerpools : {address?.allWorkerpools.length}
            </p>
            <AddressWorkerpoolsTable addressAddress={addressAddress} />
          </>
        )}
        {currentTab === 6 && (
          <>
            <AddressDatasetsReceivedAccessTable
              addressAddress={addressAddress}
            />
            <AddressAppsReceivedAccessTable addressAddress={addressAddress} />
            <AddressWorkerpoolsReceivedAccessTable
              addressAddress={addressAddress}
            />
          </>
        )}
        {currentTab === 7 && (
          <>
            <AddressDatasetsGrantedAccessTable
              addressAddress={addressAddress}
            />
            <AddressAppsGrantedAccessTable addressAddress={addressAddress} />
            <AddressWorkerpoolsGrantedAccessTable
              addressAddress={addressAddress}
            />
          </>
        )}
      </div>
    </>
  );
}
