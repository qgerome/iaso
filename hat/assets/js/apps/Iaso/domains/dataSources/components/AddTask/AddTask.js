import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import MESSAGES from '../../messages';
import ConfirmCancelDialogComponent from '../../../../components/dialogs/ConfirmCancelDialogComponent';
import { UneditableFields } from './UneditableFields';
import { EditableTextFields } from './EditableTextFields';
import { Checkboxes } from './Checkboxes';
import { postRequestHandler } from '../../../../utils/requests';

// TODO discuss way to remove dispatch prop drilling
const sendRequest = (requestBody, dispatch) => {
    if (requestBody)
        return postRequestHandler({
            url: '/api/dhis2ouimporter/',
            body: requestBody,
            errorKeyMessage: 'dhisouimporterError',
            consoleError: 'DHIS OU Importer',
            dispatch,
        });
    return null;
};

const useSendRequest = requestBody => {
    const dispatch = useDispatch();
    const [result, setResult] = useState(null);
    useEffect(() => {
        const executeRequest = async () => {
            const response = await sendRequest(requestBody, dispatch);
            if (response) setResult(response);
        };
        // TODO add error handling
        executeRequest();
    }, [requestBody]);
    return result;
};

const AddTask = ({ renderTrigger, titleMessage, sourceId, sourceVersion }) => {
    const [dhisUrl, setDhisUrl] = useState(null);
    const [dhisLogin, setDhisLogin] = useState(null);
    const [dhisPassword, setDhisPassword] = useState(null);
    const [continueOnError, setContinueOnError] = useState(false);
    const [validateStatus, setValidateStatus] = useState(false);
    const [goToPageWhenDone, setGoToPageWhenDone] = useState(false);
    const [allowConfirm, setAllowConfirm] = useState(false);
    const [requestBody, setRequestBody] = useState();
    const [closeDialogCallback, setCloseDialogCallback] = useState(null);
    // TODO add reset function for custom hooks values
    const dhisOu = useSendRequest(requestBody);

    const onConfirm = useCallback(
        closeDialog => {
            setAllowConfirm(false);
            setCloseDialogCallback(() => closeDialog);
            setRequestBody({
                source_id: sourceId,
                source_version_number: sourceVersion,
                dhis2_url: dhisUrl,
                dhis2_login: dhisLogin,
                dhis2_password: dhisPassword,
                force: false,
                validate_status: validateStatus,
                continue_on_error: continueOnError,
            });
        },
        [
            sourceId,
            sourceVersion,
            dhisUrl,
            dhisLogin,
            dhisPassword,
            validateStatus,
            continueOnError,
        ],
    );

    useEffect(() => {
        if (dhisUrl && dhisLogin && dhisPassword) {
            setAllowConfirm(true);
        } else {
            setAllowConfirm(false);
        }
    }, [dhisUrl, dhisLogin, dhisPassword]);

    useEffect(() => {
        if (dhisOu)
            // TODO reset dhisOu and updatedDefaultDataSource values
            closeDialogCallback();
    }, [closeDialogCallback, dhisOu]);

    return (
        <ConfirmCancelDialogComponent
            renderTrigger={renderTrigger}
            titleMessage={titleMessage}
            onConfirm={onConfirm}
            onClosed={() => {}}
            confirmMessage={MESSAGES.save}
            cancelMessage={MESSAGES.cancel}
            maxWidth="sm"
            allowConfirm={allowConfirm}
        >
            <UneditableFields
                fields={[
                    {
                        keyValue: 'source_name',
                        value: sourceId,
                        label: MESSAGES.dataSourceName,
                    },
                    {
                        keyValue: 'source_version',
                        value: sourceVersion,
                        label: MESSAGES.dataSourceVersion,
                    },
                ]}
            />
            <EditableTextFields
                fields={[
                    {
                        keyValue: 'dhis_url',
                        label: MESSAGES.dhisUrl,
                        value: dhisUrl,
                        onChange: setDhisUrl,
                    },
                    {
                        keyValue: 'dhis_login',
                        label: MESSAGES.dhisLogin,
                        value: dhisLogin,
                        onChange: setDhisLogin,
                    },
                    {
                        keyValue: 'dhis_password',
                        label: MESSAGES.dhisPassword,
                        value: dhisPassword,
                        onChange: setDhisPassword,
                        password: true,
                    },
                ]}
            />
            <Checkboxes
                checkboxes={[
                    {
                        keyValue: 'continue_on_error',
                        label: MESSAGES.continueOnError,
                        value: continueOnError,
                        onChange: setContinueOnError,
                    },
                    {
                        keyValue: 'validate_status',
                        label: MESSAGES.validateStatus,
                        value: validateStatus,
                        onChange: setValidateStatus,
                    },
                    {
                        keyValue: 'go_to_current_task',
                        label: MESSAGES.goToCurrentTask,
                        value: goToPageWhenDone,
                        onChange: setGoToPageWhenDone,
                    },
                ]}
            />
        </ConfirmCancelDialogComponent>
    );
};

AddTask.propTypes = {
    renderTrigger: PropTypes.func.isRequired,
    titleMessage: PropTypes.object.isRequired,
    sourceId: PropTypes.number.isRequired,
    sourceVersion: PropTypes.number.isRequired,
};

export { AddTask };
