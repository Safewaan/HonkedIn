import React from 'react';
import Events from '../componentsTest/Events';
import { render } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

describe('<Events />', () => {

  it('loads events on first render', async () => {
    global.fetch = jest.fn(() => {
      Promise.resolve();
    })

    const loadGetEvents = jest.fn().mockName('loadGetEvents');
    render(<Events loadGetEvents={loadGetEvents}/>);
    expect(loadGetEvents).toHaveBeenCalled();
    
  });
});