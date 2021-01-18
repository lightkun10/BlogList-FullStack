import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import Blog from './Blog';

describe('<Blog />', () => {
  let component = null;
  let addLike = null;
  let onDelete = null;
  const blog = {
    title: 'test-title',
    author: 'test-author',
    url: 'test-url',
    likes: 'test-likes',
    user: {
      username: 'test-username',
      name: 'test-name',
      id: 'test-user-id',
    },
    id: 'test-id',
  };

  beforeEach(() => {
    addLike = jest.fn();
    onDelete = jest.fn();
    component = render(
      <Blog blog={blog} addLike={addLike} onDelete={onDelete} />
    );
  });

  test('shows ONLY title and author by default', () => {
    const componentTitle = component.container.querySelector('.blog__entry__content')
      .querySelector('.blog__entry__content__title');
    const componentAuthor = component.container.querySelector('.blog__entry__content')
      .querySelector('.blog__entry__content__author');

    expect(componentTitle).toHaveTextContent('test-title');
    expect(componentAuthor).toHaveTextContent('test-author');
    expect(component.container).not.toHaveTextContent('test-url');
    expect(component.container).not.toHaveTextContent('test-likes');
  });

  test('blog\'s url and number of likes are shown when the details button clicked', () => {
    const detailButton =
      component.container.querySelector('.blog__entry__button__toggledetail')
    fireEvent.click(detailButton);
    expect(component.container).toHaveTextContent('test-url');
    expect(component.container).toHaveTextContent('test-likes');
  });

  test('if the like button is clicked twice, the event handler is called twice', () => {
    const detailButton =
      component.container.querySelector('.blog__entry__button__toggledetail');
    fireEvent.click(detailButton);

    const likeButton = component.container
      .querySelector('.blog__entry__detail')
      .querySelector('.blog__entry__detail__likes__button');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);
    expect(addLike.mock.calls).toHaveLength(2);
  })

});
