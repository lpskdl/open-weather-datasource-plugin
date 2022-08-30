import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';
import { getBackendSrv } from '@grafana/runtime';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  appId: string;
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.appId = instanceSettings.jsonData.appId;
  }

  async doRequest(query: MyQuery) {
    const result = await getBackendSrv().get('https://api.openweathermap.org/data/2.5/weather', {
      lat: query.latitude,
      lon: query.longitude,
      appid: this.appId,
      units: query.units,
    });

    return result;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((target) => {
      const query = defaults(target, defaultQuery);

      return this.doRequest(query).then((response) => {
        const frame = new MutableDataFrame({
          refId: query.refId,
          fields: [
            { name: 'Time', type: FieldType.time },
            { name: 'Value', type: FieldType.number },
          ],
        });

        frame.appendRow([Date.now(), response.main.temp]);

        return frame;
      });
    });

    return Promise.all(promises).then((data) => {
      return { data };
    });
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
