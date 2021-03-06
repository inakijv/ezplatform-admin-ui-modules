import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconComponent from '../../../common/icon/icon.component';
import { CHECKMARK } from '../../../common/icon/defs/checkmark.json';
import { DISCARD } from '../../../common/icon/defs/discard.json';
import { EDIT } from '../../../common/icon/defs/edit.json';

import './css/table.view.item.component.css';

export default class TableViewItemComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            priorityValue: props.location.priority,
            priorityInputEnabled: false,
            startingPriorityValue: props.location.priority
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.priorityInputEnabled !== nextState.priorityInputEnabled;
    }

    /**
     * Enables priority input field
     *
     * @method enablePriorityInput
     * @memberof TableViewItemComponent
     */
    enablePriorityInput() {
        this.setState(state => Object.assign({}, state, {priorityInputEnabled: true}));
    }

    /**
     * Handles priority update cancel action.
     * Restores previous value and blocks the priority input.
     *
     * @method handleCancel
     * @param {Event} event
     * @memberof TableViewItemComponent
     */
    handleCancel(event) {
        event.preventDefault();

        this.setState(state => Object.assign({}, state, {
            priorityInputEnabled: false,
            priorityValue: state.startingPriorityValue
        }));
    }

    /**
     * Handles submit action.
     * Updates priority value.
     *
     * @method handleSubmit
     * @param {Event} event
     * @memberof TableViewItemComponent
     */
    handleSubmit(event) {
        event.preventDefault();

        this.props.onItemPriorityUpdate({
            location: this.props.location._href,
            priority: this._refPriorityInput.value
        });

        this.setState(state => Object.assign({}, state, {
            priorityValue: this._refPriorityInput.value,
            priorityInputEnabled: false,
            startingPriorityValue: this._refPriorityInput.value
        }));
    }

    /**
     * Stores priority value
     *
     * @method storePriorityValue
     * @param {Event} event
     * @memberof TableViewItemComponent
     */
    storePriorityValue(event) {
        event.preventDefault();

        this.setState(state => Object.assign({}, state, {priorityValue: this._refPriorityInput.value}))
    }

    /**
     * Creates edit link
     *
     * @method createEditLink
     * @return {String}
     * @memberof TableViewItemComponent
     */
    createEditLink() {
        return Routing.generate('ez_content_draft_create', {
            contentId: this.props.content._id,
        });
    }

    /**
     * Renders a priority cell with input field
     *
     * @method renderPriorityCell
     * @returns {Element}
     * @memberof TableViewItemComponent
     */
    renderPriorityCell() {
        const inputAttrs = {
            type: 'number',
            defaultValue: this.state.priorityValue,
            onChange: this.storePriorityValue.bind(this)
        };
        const priorityWrapperAttrs = {};
        const innerWrapperAttrs = {};

        if (!this.state.priorityInputEnabled) {
            inputAttrs.disabled = true;
            priorityWrapperAttrs.onClick = this.enablePriorityInput.bind(this);
            priorityWrapperAttrs.className = 'c-table-view-item__inner-wrapper--disabled';
            innerWrapperAttrs.hidden = true;
        }

        return (
            <td className="c-table-view-item__cell--priority">
                <div className="c-table-view-item__priority-wrapper" {...priorityWrapperAttrs}>
                    <div className="c-table-view-item__inner-wrapper c-table-view-item__inner-wrapper--input">
                        <input className="c-table-view-item__priority-value" ref={ref => this._refPriorityInput = ref} {...inputAttrs} />
                    </div>
                    <div className="c-table-view-item__priority-actions" {...innerWrapperAttrs}>
                        <button className="c-table-view-item__btn--submit" onClick={this.handleSubmit.bind(this)}>
                            <IconComponent icon={CHECKMARK} color="#fff" />
                        </button>
                        <button className="c-table-view-item__btn--cancel" onClick={this.handleCancel.bind(this)}>
                            <IconComponent icon={DISCARD} color="#fff" />
                        </button>
                    </div>
                </div>
            </td>
        );
    }

    render() {
        const {content, location, contentTypesMap, labels, locationViewLink} = this.props;
        const date = new Date(content.lastModificationDate);
        const contentType = contentTypesMap[content.ContentType._href];
        const contentTypeName = contentType ? contentType.names.value[0]['#text'] : labels.notAvailable;

        return (
            <tr className="c-table-view-item">
                <td className="c-table-view-item__cell--name">
                    <a className="c-table-view-item__link" href={locationViewLink.replace('{{locationId}}', location.id)}>{content.Name}</a>
                </td>
                <td className="c-table-view-item__cell--modified">{date.toLocaleDateString()}<br/>{date.toLocaleTimeString()}</td>
                <td className="c-table-view-item__cell--content-type">{contentTypeName}</td>
                {this.renderPriorityCell()}
                <td className="c-table-view-item__cell--translations">{content.mainLanguageCode}</td>
                <td className="c-table-view-item__cell--actions">
                    <div>
                    <a href={this.createEditLink()} className="c-table-view-item__btn--edit">
                        <div className="c-table-view-item__btn-inner">
                            <IconComponent icon={EDIT} height={20} color="#fff" />
                            {labels.edit}
                        </div>
                    </a>
                    </div>
                </td>
            </tr>
        );
    }
}

TableViewItemComponent.propTypes = {
    content: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    onItemPriorityUpdate: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        edit: PropTypes.string.isRequired,
        notAvailable: PropTypes.string.isRequired
    }).isRequired,
    locationViewLink: PropTypes.string.isRequired
};
