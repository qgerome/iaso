import { defineMessages } from 'react-intl';

const MESSAGES = defineMessages({
    title: {
        defaultMessage: 'Beneficiary types',
        id: 'iaso.entityTypes.title',
    },
    referenceForm: {
        defaultMessage: 'reference form',
        id: 'iaso.entityTypes.referenceForm',
    },
    create: {
        defaultMessage: 'Create beneficiary type',
        id: 'iaso.entityTypes.create',
    },
    cancel: {
        id: 'iaso.label.cancel',
        defaultMessage: 'Cancel',
    },
    save: {
        id: 'iaso.label.save',
        defaultMessage: 'Save',
    },
    deleteError: {
        id: 'iaso.snackBar.deleteEntityTypeError',
        defaultMessage: 'An error occurred while deleting beneficiary type',
    },
    deleteSuccess: {
        id: 'iaso.snackBar.delete_successful',
        defaultMessage: 'Deleted successfully',
    },
    search: {
        defaultMessage: 'Search',
        id: 'iaso.search',
    },
    name: {
        defaultMessage: 'Name',
        id: 'iaso.label.name',
    },
    updateMessage: {
        defaultMessage: 'Update beneficiary type',
        id: 'iaso.entityTypes.update',
    },
    deleteTitle: {
        id: 'iaso.entityTypes.dialog.deleteTitle',
        defaultMessage:
            'Are you sure you want to delete this beneficiary type?',
    },
    deleteText: {
        id: 'iaso.label.deleteText',
        defaultMessage: 'This operation cannot be undone.',
    },
    edit: {
        defaultMessage: 'Edit',
        id: 'iaso.label.edit',
    },
    actions: {
        defaultMessage: 'Action(s)',
        id: 'iaso.label.actions',
    },
    types: {
        defaultMessage: 'Types',
        id: 'iaso.entities.types',
    },
    type: {
        defaultMessage: 'Type',
        id: 'iaso.entities.type',
    },
    updated_at: {
        id: 'iaso.forms.updated_at',
        defaultMessage: 'Updated',
    },
    created_at: {
        id: 'iaso.forms.created_at',
        defaultMessage: 'Created',
    },
    nameRequired: {
        id: 'iaso.pages.errors.name',
        defaultMessage: 'Name is required',
    },
    viewForm: {
        id: 'iaso.forms.viewForm',
        defaultMessage: 'View form',
    },
    entitiesCount: {
        id: 'iaso.entityTypes.count',
        defaultMessage: 'Beneficiaries count',
    },
    fieldsDetailInfoView: {
        id: 'iaso.entityTypes.fieldsDetailInfoView',
        defaultMessage: 'Detail info fields',
    },
    fieldsListView: {
        id: 'iaso.entityTypes.fieldsListView',
        defaultMessage: 'List fields',
    },
    selectReferenceForm: {
        id: 'iaso.entityTypes.selectReferenceForm',
        defaultMessage: 'Select a reference form first',
    },
});

export default MESSAGES;
