import React from 'react';
import { render } from '@testing-library/react';
import Forum from '../componentsTest/ForumTest'

describe('<ForumTest />', () => {

  it('loads comments on first render', async () => {
    global.fetch = jest.fn(() => {
      Promise.resolve();
    })

    const loadGetForumCommentsByForumID = jest.fn().mockName('loadGetForumCommentsByForumID');
    render(<Forum loadGetForumCommentsByForumID={loadGetForumCommentsByForumID}/>);
    expect(loadGetForumCommentsByForumID).toHaveBeenCalled();

  });
});