import React from 'react';
import Forums from '../componentsTest/Forums';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

describe('<Forums />', () => {

    it('loads forums on first render', () => {
        const loadGetForums = jest.fn().mockName('loadGetForums');
        const forums = [];
        render(<Forums loadGetForums={loadGetForums} forums={forums} />);
        expect(loadGetForums).toHaveBeenCalled();
    });

    it('displays the forum titles', () => {
        const noop = () => { };
        const forums = [
            {
                "id": 1, "creatorID": 1, "forumTitle": "First Forum Title Test", "description": "Test Forum Description",
                "dateTime": "2023-02-24T05:00:00.000Z", "status": "Active"
            },
            {
                "id": 2, "creatorID": 2, "forumTitle": "Second Forum Title Test", "description": "Test Forum Description",
                "dateTime": "2023-02-24T05:00:00.000Z", "status": "Active"
            }
        ];

        render(<Forums loadGetForums={noop} forums={forums} />);
        expect(screen.getByText('First Forum Title Test')).toBeInTheDocument();
    }); 

    it('displays the forum creator name and posted date', () => {
        const noop = () => { };
        const forums = [
            {
                "id": 1, "creatorID": 1, "creatorName": "Gabrielle Tang", "forumTitle": "First Forum Title Test", "description": "Test Forum Description",
                "dateTime": "2023-02-24T05:00:00.000Z", "status": "Active"
            }
        ];

        render(<Forums loadGetForums={noop} forums={forums} />);
        //expect(screen.getByText("Posted on 2023-02-23 by Gabrielle Tang")).toBeInTheDocument();
        expect(screen.getByText("Posted on 2/23/2023 by Gabrielle Tang")).toBeInTheDocument();
    }); 

    it('displays the forum descriptions', () => {
        const noop = () => { };
        const forums = [
            {
                "id": 1, "creatorID": 1, "forumTitle": "First Forum Title Test", "description": "First Test Forum Description",
                "dateTime": "2023-02-24T05:00:00.000Z", "status": "Active"
            },
            {
                "id": 2, "creatorID": 2, "forumTitle": "Second Forum Title Test", "description": "Second Test Forum Description",
                "dateTime": "2023-02-24T05:00:00.000Z", "status": "Active"
            }
        ];

        render(<Forums loadGetForums={noop} forums={forums} />);
        expect(screen.getByText('First Forum Title Test')).toBeInTheDocument();
        expect(screen.getByText('Second Forum Title Test')).toBeInTheDocument();
    }); 

});


