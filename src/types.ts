import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  latitude: number;
  longitude: number;
  units?: 'standard' | 'metric' | 'imperial';
}

export const defaultQuery: Partial<MyQuery> = {
  latitude: 52.5060662,
  longitude: 13.344162,
  units: 'metric',
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
  appId: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey: string;
}
