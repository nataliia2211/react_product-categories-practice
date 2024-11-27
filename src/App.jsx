/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const preparedProducts = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(cat => cat.id === product.categoryId) || null;
  const user = usersFromServer.find(usr => usr.id === category.ownerId) || null;

  return {
    ...product,
    category: `${category.icon} - ${category.title}`,
    user,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [query, setQuery] = useState('');

  const filteredUser = id => setSelectedUser(id);
  const clearSearch = () => setQuery('');
  const onReset = () => {
    setSelectedUser('All');
    setQuery('');
  };

  const filteredProducts = preparedProducts.filter(product => {
    const requiredUser =
      selectedUser === 'All' || product.user.id === selectedUser;
    const requiredSearch = product.name
      .toLowerCase()
      .includes(query.toLowerCase());

    return requiredUser && requiredSearch;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({'is-active': selectedUser === 'All'})}
                onClick={() => filteredUser('All')}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  key={user.id}
                  href="#/"
                  className={cn({'is-active': selectedUser === user.id})}
                  onClick={() => filteredUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={clearSearch}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <button
                type="button"
                className="button is-link is-outlined is-fullwidth"
                onClick={onReset}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table className="table is-striped is-narrow is-fullwidth">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td data-cy="ProductId" className="has-text-weight-bold">
                      {product.id}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
