import classnames from 'classnames';
import React from 'react';

import EventTypes from '../../constants/EventTypes';
import propsMap from '../../../../shared/constants/propsMap';
import SidebarFilter from './SidebarFilter';
import TorrentFilterStore from '../../stores/TorrentFilterStore';
import TorrentStore from '../../stores/TorrentStore';
import UIActions from '../../actions/UIActions';

const METHODS_TO_BIND = [
  'getFilters',
  'handleClick',
  'onTagFilterChange',
  'onTorrentTaxonomyChange'
];

export default class TagFilters extends React.Component {
  constructor() {
    super();

    this.state = {
      tagCount: {},
      tagFilter: TorrentFilterStore.getTagFilter()
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    TorrentFilterStore.listen(EventTypes.CLIENT_FETCH_TORRENT_TAXONOMY_SUCCESS,
      this.onTorrentTaxonomyChange);
    TorrentFilterStore.listen(EventTypes.UI_TORRENTS_FILTER_TAG_CHANGE,
      this.onTagFilterChange);
  }

  componentWillUnmount() {
    TorrentFilterStore.unlisten(EventTypes.CLIENT_FETCH_TORRENT_TAXONOMY_SUCCESS,
      this.onTorrentTaxonomyChange);
    TorrentFilterStore.unlisten(EventTypes.UI_TORRENTS_FILTER_TAG_CHANGE,
      this.onTagFilterChange);
  }

  getFilters() {
    let filterItems = Object.keys(this.state.tagCount).sort((a, b) => {
      if (a === 'all') {
        return -1;
      } else if (b === 'all') {
        return 1;
      }

      return a.localeCompare(b);
    });

    let filterElements = filterItems.map((filter, index) => {
      return (
        <SidebarFilter handleClick={this.handleClick}
          count={this.state.tagCount[filter] || 0}
          key={filter}
          isActive={filter === this.state.tagFilter}
          name={filter}
          slug={filter} />
      );
    });

    return filterElements;
  }

  handleClick(filter) {
    UIActions.setTorrentTagFilter(filter);
  }

  onTagFilterChange() {
    this.setState({tagFilter: TorrentFilterStore.getTagFilter()});
  }

  onTorrentTaxonomyChange() {
    let tagCount = TorrentFilterStore.getTorrentTagCount();
    this.setState({tagCount});
  }

  render() {
    let filters = this.getFilters();

    if (filters.length === 0) {
      return null;
    }

    return (
      <ul className="sidebar-filter sidebar__item">
        <li className="sidebar-filter__item sidebar-filter__item--heading">
          Filter by Tag
        </li>
        {filters}
      </ul>
    );
  }
}
