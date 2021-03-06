import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeLeafComponent from './finder.tree.leaf.component';

import './css/finder.tree.branch.component.css';

export default class FinderTreeBranchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLocations: props.selectedLocations
        };
    }

    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {selectedLocations: props.selectedLocations}));
    }

    /**
     * Updates selected locations state
     *
     * @method updateSelectedLocations
     * @param {Object} location location struct
     * @memberof FinderTreeBranchComponent
     */
    updateSelectedLocations(location) {
        this.setState(state => {
            const locations = [...state.selectedLocations, location.id];

            return Object.assign({}, state, {selectedLocations: [...new Set(locations)]});
        });

        this.props.onItemClick({
            parent: location.id,
            location
        });
    }

    /**
     * Renders leaf (the single content item)
     *
     * @method renderLeaf
     * @param {Object} data location response
     * @returns {Element}
     * @memberof FinderTreeBranchComponent
     */
    renderLeaf(data) {
        const location = data.value.Location;

        return <FinderTreeLeafComponent
            key={location.remoteId}
            location={location}
            onClick={this.updateSelectedLocations.bind(this)}
            selected={this.state.selectedLocations.includes(location.id)} />
    }

    render() {
        return (
            <div className="c-finder-tree-branch">
                <div className="c-finder-tree-branch__list-wrapper">
                    {this.props.items.map(this.renderLeaf.bind(this))}
                </div>
            </div>
        );
    }
}

FinderTreeBranchComponent.propTypes = {
    items: PropTypes.array.isRequired,
    parent: PropTypes.number.isRequired,
    onItemClick: PropTypes.func.isRequired,
    selectedLocations: PropTypes.array.isRequired
};
