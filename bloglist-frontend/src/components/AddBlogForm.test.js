import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import AddBlogForm from './AddBlogForm';

describe('<AddBlogForm />', () => {
  let component = null;
  const newBlog = {
    title: 'test-title',
    author: 'test-author',
    url: 'test-url',
  };
  let createBlog = null;

  beforeEach(() => {
    createBlog = jest.fn();
    component = render(
      <AddBlogForm createBlog={createBlog} />
    );
  });

  test('', () => {
    const form = component.container.querySelector('.blog__addform__form');
    const titleInput = form
      .querySelector('.blog__addform__form__title')
      .querySelector('#title');
    const authorInput = form
      .querySelector('.blog__addform__form__author')
      .querySelector('#author');
    const urlInput = form
      .querySelector('.blog__addform__form__url')
      .querySelector('#url');

    fireEvent.change(titleInput, {
      target: { value: newBlog.title }
    });
    fireEvent.change(authorInput, {
      target: { value: newBlog.author }
    });
    fireEvent.change(urlInput, {
      target: { value: newBlog.url }
    });

    fireEvent.submit(form);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual(newBlog);
  });
});

