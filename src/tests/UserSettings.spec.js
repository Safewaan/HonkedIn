import React from 'react';
import { render, screen } from '@testing-library/react';
import UpdateCredentials from '../componentsTest/UserSettingsTest'

describe('<UserSettingsTest />', () => {

  it('loads buttons on first render', async () => {
    global.fetch = jest.fn(() => {
      Promise.resolve();
    })

    const loading = jest.fn().mockName('loading');
    render(<UpdateCredentials loading={loading}/>);
    expect(loading).toHaveBeenCalled();

  });
});