import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { APIProvider, useApiLoadingStatus, APILoadingStatus, APIProviderProps } from '@vis.gl/react-google-maps';

const statusMap: Record<APILoadingStatus, 'LOADING' | 'SUCCESS' | 'FAILURE'> = {
  [APILoadingStatus.NOT_LOADED]: 'LOADING',
  [APILoadingStatus.LOADING]: 'LOADING',
  [APILoadingStatus.LOADED]: 'SUCCESS',
  [APILoadingStatus.FAILED]: 'FAILURE',
  [APILoadingStatus.AUTH_FAILURE]: 'FAILURE',
};

export type GoogleMapsWrapperProps = PropsWithChildren<
  {
    apiKey: string;
    renderFallback?: (status: 'LOADING' | 'SUCCESS' | 'FAILURE') => ReactNode;
  } & Omit<APIProviderProps, 'apiKey'>
>;

const InnerWrapper: React.FC<{
  renderFallback?: (status: 'LOADING' | 'SUCCESS' | 'FAILURE') => ReactNode;
  children: ReactNode;
}> = ({ renderFallback, children }) => {
  const status = useApiLoadingStatus();
  const mappedStatus = statusMap[status];

  if (status === APILoadingStatus.LOADED) {
    return <>{children}</>;
  }

  if (renderFallback) {
    return <>{renderFallback(mappedStatus)}</>;
  }

  return (
    <div className="w-full h-80 rounded-2xl bg-[#EBE7DF]/60 flex items-center justify-center p-6 text-center border border-[#173B3A]/10">
      <div className="space-y-2 max-w-sm">
        <div className="w-8 h-8 rounded-full border-2 border-[#164E47] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#173B3A]">
          {mappedStatus === 'LOADING' ? 'Connecting to Google Maps Platform...' : 'Maps preview active'}
        </p>
      </div>
    </div>
  );
};

export const GoogleMapsWrapper: FunctionComponent<GoogleMapsWrapperProps> = ({
  apiKey,
  children,
  renderFallback,
  ...apiProps
}) => {
  return (
    <APIProvider apiKey={apiKey} {...apiProps}>
      <InnerWrapper renderFallback={renderFallback}>{children}</InnerWrapper>
    </APIProvider>
  );
};
