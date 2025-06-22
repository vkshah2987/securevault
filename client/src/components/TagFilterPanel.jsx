import React from 'react';

const TagFilterPanel = ({ allTags = [], activeTag, onTagSelect }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Filter by Tag:</h4>
      <button
        onClick={() => onTagSelect('All')}
        disabled={activeTag === 'All'}
      >
        All
      </button>
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          disabled={activeTag === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilterPanel;
