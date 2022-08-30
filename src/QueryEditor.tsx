import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

function getUnits(value: string) {
  switch (value) {
    case 'imperial':
      return 'imperial';
    case 'metric':
      return 'metric';
    case 'standard':
      return 'standard';
    default:
      return 'metric';
  }
}
export class QueryEditor extends PureComponent<Props> {
  onLatitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, latitude: parseFloat(event.target.value) });
    // onRunQuery();
  };
  onLongitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, longitude: parseFloat(event.target.value) });
    // onRunQuery();
  };
  onUnitsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, units: getUnits(event.target.value) });
  };

  onSubmit = (e: React.SyntheticEvent) => {
    const { onRunQuery } = this.props;
    e.preventDefault();
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { longitude, latitude, units } = query;

    return (
      <form onSubmit={this.onSubmit}>
        <div className="gf-form">
          <FormField width={4} value={latitude} onChange={this.onLatitudeChange} label="Latitude" type="number" />
          <FormField width={4} value={longitude} onChange={this.onLongitudeChange} label="Longitude" type="number" />
          <FormField width={4} value={units} onChange={this.onUnitsChange} label="Units" type="string" />
        </div>
        <button type="submit" value={'run query'} />
      </form>
    );
  }
}
