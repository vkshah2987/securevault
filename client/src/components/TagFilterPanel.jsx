import { useState } from "react";

const TagFilterPanel = ({ allTags = [], activeTag, onTagSelect }) => {
  const [panelState, setPanelState] = useState(true)

  return (
    <div className="filterContainer glassEffect">

      <div className="filterHead" onClick={() => setPanelState(!panelState)}>
        <div><img src="src/assets/tag.svg"></img>Categories</div>
        <img src="src/assets/downArrow.svg" alt="" />
      </div>

      {panelState && <div className="filterOptions">
        <button className={`filterBtn ${ activeTag === 'All' ? 'btnClicked withDot' : '' }`}
          onClick={() => onTagSelect('All')}
          disabled={activeTag === 'All'}
        >
          All
        </button>

        {allTags.map((tag) => (
          <button className={`filterBtn ${ activeTag === tag ? 'btnClicked withDot' : '' }`}
            key={tag}
            onClick={() => onTagSelect(tag)}
            disabled={activeTag === tag}
          >
            {tag}
          </button>
        ))}
      </div>}
    </div>
  );
};

export default TagFilterPanel;
