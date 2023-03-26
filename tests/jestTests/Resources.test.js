import React from 'react';
 import Resources from '../componentsTest/Resources';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';

 describe('<Resources />', () => {

     it('loads the resources on first render', () => {
         const getResources = jest.fn().mockName('getResources');
         const resources = [];
         render(<Resources getResources={getResources} resources={resources} />);
         expect(getResources).toHaveBeenCalled();
     });


    

 });