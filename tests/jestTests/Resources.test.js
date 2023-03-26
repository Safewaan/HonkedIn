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

     it('displays the title of resource', () => {
        const noop = () => { };
        const resources = [
          {
            "id": 1, "creatorID": 1, "creatorName": "Chloe Choi", "resourcesTitle": "Test Resource 1", "resourcesLink": "https://docs.google.com/document/d/1eiCUtxTaOD1jfti3drg-7Gg36Z_vNd1Gzmpfr8CfMD8/edit",
            "dateTime": "2023-02-23T05:00:00.000Z",  "mediaTag": "Youtube"
          }
        ]
    
        render(<Resources getResources={noop} resources={resources} />);
        expect(screen.getByText('Test Resource 1')).toBeInTheDocument();
      });
    

 });