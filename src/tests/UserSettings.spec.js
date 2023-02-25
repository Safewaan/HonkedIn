/* import React from 'react';
import { render, screen } from '@testing-library/react';
import UpdateCredentials from '../componentsTest/UserSettingsTest'

describe('<UserSettingsTest />', () => {

  it('loads buttons on first render', async () => {
    global.fetch = jest.fn(() => {
      Promise.resolve();
    })

    const redirectUpdateCredentials = jest.fn().mockName('redirectUpdateCredentials');
    render(<UpdateCredentials redirectUpdateCredentials={redirectUpdateCredentials}/>);
    expect(redirectUpdateCredentials).toHaveBeenCalled();

  });
}); */