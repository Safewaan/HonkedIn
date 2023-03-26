import React from 'react';
import Network from '../componentsTest/Network';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('<Network />', () => {

    it('loads list of users on first render', () => {
        const handleFindUser = jest.fn().mockName('handleFindUser');
        const profiles = [];
        render(<Network handleFindUser={handleFindUser} profiles={profiles} />);
        expect(handleFindUser).toHaveBeenCalled();
    });

    it('displays the users names', () => {
        const noop = () => { };
        const profiles = [
            /*userProfiles.userID, userProfiles.aboutMe, userProfiles.yearSemester, userProfiles.program, 
            userProfiles.interest, userProfiles.coop, userProfiles.pictureURL, 
            CONCAT(users.firstName, " ", users.lastName) as userName */
            {
                "userID": 1, "aboutMe": "I like passing tests", "yearSemester": "PHD",
                "program": "Management Sciences", "interest": "Writing tests", "coop": "TA for MSCI 123",
                "pictureURL": "https://image.similarpng.com/very-thumbnail/2021/05/Checkmark-green-tick-isolated-on-transparent-background-PNG.png", 
                "userName": "Passing Test"
            }
        ];

        render(<Network handleFindUser={noop} profiles={profiles} />);
        expect(screen.getByText('Passing Test')).toBeInTheDocument();
    });
});