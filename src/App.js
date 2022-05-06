import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "./use-labeled-hooks";
import useFetchData from "./use-fetch-data";

export default function App() {
  const [query, setQuery] = useState("React", { debugLabel: "query" });
  const [
    {
      data: articleData,
      isLoading: isArticleDataLoading,
      hasError: hasArticleDataError
    },
    fetchArticleData
  ] = useFetchData();

  // useEffect(() => console.log(query), [query], {
  //   debugLabel: "[query]"
  // });

  // function log() {
  //   console.log(query);
  // }
  // useEffect(log, [query], {
  //   debugLabel: "[query]"
  // });

  return (
    <>
      <form
        onSubmit={event => {
          event.preventDefault();
          fetchArticleData(
            `https://hn.algolia.com/api/v1/search?query=${query}`
          );
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Fetch</button>
        <button
          onClick={() => {
            fetchArticleData(
              `https://hn.algolia.com/api/v1/search?query=${query}`
            );
            ReactDOM.unmountComponentAtNode(document.getElementById("root"));
          }}
        >
          Fetch & Unmount
        </button>
      </form>

      {isArticleDataLoading ? (
        <p>Loading ...</p>
      ) : hasArticleDataError ? (
        <p>Error: {hasArticleDataError}</p>
      ) : !articleData ? (
        <p>Search for some articles.</p>
      ) : !articleData?.hits.length ? (
        <p>No results.</p>
      ) : (
        <ul>
          {articleData?.hits?.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
