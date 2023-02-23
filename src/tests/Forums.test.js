import {render} from '@testing-library/react';
import Forums from '../componentsTest/Forums';
import React from "react"; 

describe('Forums list', () => {
    it('loads forums on first render', () => {
    const loadGetForums = jest.fn().mockName('loadGetForums');
    render(<Forums loadGetForums={loadGetForums} />);
    expect(loadGetForums).toHaveBeenCalled();
    });
   });