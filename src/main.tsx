// @ts-nocheck

import React, { useCallback, useState, useEffect } from "react";
import { set, unset } from "sanity";
import { Card } from "@sanity/ui";

import Popup from "./components/Popup";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Tabs from "./components/Tabs";
import Menu from "./components/Menu";
import { getIcons } from "./utils/icons";

const LOADING_TIMER_MS = 400;

const IconPicker = React.forwardRef((props, ref) => {
  const { type, value = {}, onChange } = props;
  const [selected, setSelected] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [queryResults, setQueryResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  function getIconByValue({ name }, icons) {
    const found = icons.find((icon) => icon.name === name);
    return found || null;
  }

  useEffect(() => {
    if (!loading) {
      setLoading(true);
    }
    const timeoutId = setTimeout(() => {
      const icons = getIcons(type.options);
      const results = icons.filter(
        (icon) => icon.name.toLowerCase().indexOf(query) >= 0
      );
      setSelected(getIconByValue(value, icons));
      setQueryResults(results);
      setLoading(false);
    }, LOADING_TIMER_MS);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const unsetIcon = () => {
    onChange(unset());
    setSelected(null);
  };

  const setIcon = (icon) => {
    if (selected && icon.name === selected.name) {
      return unsetIcon();
    }

    useCallback((_event) => {
      onChange(() => {
        set(icon.provider, ["provider"])
        set(icon.name, ["name"])
        // THIS LINE
        set(type, type.name)
      });
      setSelected(icon);
    })
  }

  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setQuery("");
  };

  const onQueryChange = (e) => {
    const query = e.target.value;
    setQuery(query);
  };
  const handlePreviewClick = (action) => {
    const actions = ["add", "edit", "delete"];
    if (action === actions[0]) return setIsPopupOpen(true);
    if (action === actions[1]) return openPopup();
    if (action === actions[2]) return unsetIcon();
  };

  const onTabClick = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, LOADING_TIMER_MS);
    }
  };

  return (
    <Card ref={ref}>
      <Menu
        reference={ref}
        onClick={handlePreviewClick}
        selected={selected}
      />

      <Popup onClose={closePopup} isOpen={isPopupOpen}>
        <SearchBar value={query} onChange={onQueryChange} />
        <Tabs options={type.options} onClick={onTabClick}>
          <SearchResults
            results={queryResults}
            selected={selected}
            onSelect={setIcon}
            loading={loading}
            query={query}
          />
        </Tabs>
      </Popup>
    </Card>
  );
});

export default IconPicker;
