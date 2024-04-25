/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categ => product.categoryId === categ.id,
  );
  const user = usersFromServer.find(user => user.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [activePerson, setActivePerson] = useState('all');
  const [query, setQuery] = useState('');
  const [sortFields, setSortFields] = useState([]);

  function getPreparedProducts(products, { query, activePerson }) {
    let preparedProducts = [...products];

    if (query) {
      preparedProducts = preparedProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (activePerson !== 'all') {
      preparedProducts = preparedProducts.filter(
        product => product.category.ownerId === activePerson.id,
      );
    }

    return preparedProducts;
  }

  const sortingBy = ['ID', 'Product', 'Category', 'User'];

  const handleResetAll = () => {
    setActivePerson('all');
    setQuery('');
    setSortFields([]);
  };

  const handleChange = event => {
    setQuery(event.currentTarget.value);
  };

  const handleToggle = field => {
    let renewSortFields;

    if (sortFields.includes(field)) {
      renewSortFields = sortFields.filter(f => f !== field);
    } else {
      renewSortFields = [...sortFields, field];
    }

    setSortFields(renewSortFields);
  };

  const preparedProducts = getPreparedProducts(products, {
    query,
    activePerson,
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
                onClick={() => setActivePerson('all')}
                className={cn({ 'is-active': activePerson === 'all' })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  onClick={() => setActivePerson(user)}
                  className={cn({ 'is-active': activePerson === user })}
                  data-cy="FilterUser"
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
                  onChange={handleChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query.length !== 0 && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${cn({ 'is-outlined': !sortFields })}`}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    key={category.id}
                    href="#/"
                    data-cy="AllCategories"
                    className={`button mr-2 my-1 ${cn({ 'is-info': sortFields.includes(category.title) })}`}
                    onClick={() => handleToggle(category.title)}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        {products.length === 0 && (
          <>
            <div className="box table-container">
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            </div>
          </>
        )}

        <table
          data-cy="ProductTable"
          className="table is-striped is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              {sortingBy.map(field => {
                return (
                  <th key={field}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      {field}
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            <Products
              products={preparedProducts}
              key={products.id}
              activePerson={activePerson}
              setActivePerson={setActivePerson}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Products = ({ products }) => {
  return (
    <>
      {products.map(product => {
        return (
          <>
            <tr data-cy="Product">
              <td className="has-text-weight-bold" data-cy="ProductId">
                {product.id}
              </td>

              <td data-cy="ProductName">{product.name}</td>
              <td data-cy="ProductCategory">
                {product.category.icon} - {product.category.title}
              </td>

              <td
                data-cy="ProductUser"
                className={
                  ('has-text-link',
                  cn({ 'has-text-danger': product.user.sex === 'f' }))
                }
              >
                {product.user.name}
              </td>
            </tr>
          </>
        );
      })}
    </>
  );
};
