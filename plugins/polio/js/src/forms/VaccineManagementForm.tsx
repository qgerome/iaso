import React, { FunctionComponent, useState } from 'react';
import {
    Box,
    Divider,
    Grid,
    makeStyles,
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import classnames from 'classnames';
// @ts-ignore
import { useSafeIntl } from 'bluesquare-components';
import { useStyles } from '../styles/theme';
import MESSAGES from '../constants/messages';
import { DateInput, TextInput } from '../components/Inputs';
import { ShipmentsForm } from './ShipmentsForm';
import { ReportingDelays } from './ReportingDelays';
import { RoundVaccinesForm } from './RoundVaccinesForm';
import { MultilineText } from '../components/Inputs/MultilineText';
import { DestructionsForm } from './DestructionsForm';

type Props = any;

const useCustomStyles = makeStyles(theme => ({
    marginTop: { width: '100%', marginTop: theme.spacing(1) },
    hiddenOpacity: {
        position: 'absolute',
        top: 0,
        left: -5000,
        zIndex: -10,
        opacity: 0,
    },
}));

export const VaccineManagementForm: FunctionComponent<Props> = () => {
    const classes: Record<string, string> = useStyles();
    const customClasses = useCustomStyles();
    const { formatMessage } = useSafeIntl();
    const {
        values: { rounds = [] },
    } = useFormikContext<any>(); // TODO add campaign typing

    const [currentRoundNumber, setCurrentRoundNumber] = useState(
        rounds.length > 0 ? rounds[0].number : undefined,
    );

    const handleRoundTabChange = (_, newValue) => {
        setCurrentRoundNumber(newValue);
    };

    return (
        <>
            {rounds.length > 0 && (
                <Grid container justifyContent="flex-start">
                    <Grid item>
                        <Box mb={2}>
                            <Tabs
                                value={currentRoundNumber}
                                className={classes.subTabs}
                                textColor="primary"
                                onChange={handleRoundTabChange}
                            >
                                {rounds.map(round => (
                                    <Tab
                                        key={round.number}
                                        className={classes.subTab}
                                        label={
                                            <span>
                                                {formatMessage(MESSAGES.round)}{' '}
                                                {round.number}
                                            </span>
                                        }
                                        value={round.number}
                                    />
                                ))}
                            </Tabs>
                        </Box>
                    </Grid>
                </Grid>
            )}
            {rounds.map((round, index) => {
                const accessor = `rounds[${index}]`;
                return (
                    <Grid
                        key={round.number}
                        container
                        spacing={2}
                        className={classnames(
                            round.number !== currentRoundNumber &&
                                customClasses.hiddenOpacity,
                        )}
                    >
                        <Divider style={{ width: '100%' }} />
                        {/* First row: vaccine */}
                        <Grid item xs={12}>
                            <Box mt={1} mb={1}>
                                <Typography variant="button">
                                    {formatMessage(MESSAGES.vaccines)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            item
                            xs={12}
                            spacing={2}
                            justifyContent="center"
                        >
                            <Grid container item lg={6} md={12}>
                                <RoundVaccinesForm
                                    roundIndex={index}
                                    round={round}
                                />
                            </Grid>
                            <Grid item lg={3} md={6}>
                                <Box mb={1}>
                                    <ReportingDelays accessor={accessor} />
                                </Box>
                            </Grid>
                            <Grid item lg={3} md={6}>
                                <Field
                                    label={formatMessage(
                                        MESSAGES.dateSignedVrf,
                                    )}
                                    fullWidth
                                    name={`${accessor}.date_signed_vrf_received`}
                                    component={DateInput}
                                />
                            </Grid>
                        </Grid>
                        {/* second row: shipments */}
                        <Divider style={{ width: '100%' }} />
                        <Grid item xs={12}>
                            <Box mt={1} mb={1}>
                                <Typography variant="button">
                                    {formatMessage(MESSAGES.shipments)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid container item xs={12}>
                            <ShipmentsForm accessor={accessor} round={round} />
                        </Grid>
                        {/* third row: Form A */}
                        <Divider style={{ width: '100%' }} />
                        <Grid item xs={12}>
                            <Box mt={1} mb={1}>
                                <Typography variant="button">
                                    {formatMessage(MESSAGES.formA)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            item
                            xs={12}
                            spacing={2}
                        >
                            <Grid item lg={3} md={6}>
                                <Field
                                    label={formatMessage(
                                        MESSAGES.formAReception,
                                    )}
                                    name={`${accessor}.forma_reception`}
                                    component={DateInput}
                                    className={classes.input}
                                />
                            </Grid>
                            <Grid item lg={3} md={6}>
                                <Field
                                    label={formatMessage(
                                        MESSAGES.formAUnusableVials,
                                    )}
                                    name={`${accessor}.forma_unusable_vials`}
                                    component={TextInput}
                                    className={classes.input}
                                />
                            </Grid>
                            <Grid item lg={3} md={6}>
                                <Field
                                    label={formatMessage(
                                        MESSAGES.formAMissingVials,
                                    )}
                                    name={`${accessor}.forma_missing_vials`}
                                    component={TextInput}
                                    className={classes.input}
                                />
                            </Grid>
                            <Grid item lg={3} md={6}>
                                <Field
                                    label={formatMessage(
                                        MESSAGES.formAUsableVials,
                                    )}
                                    name={`${accessor}.forma_usable_vials`}
                                    component={TextInput}
                                    className={classes.input}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            item
                            xs={12}
                            spacing={2}
                            justifyContent="flex-start"
                        >
                            <Grid item lg={3} md={6}>
                                <Field
                                    label={formatMessage(MESSAGES.formADate)}
                                    name={`${accessor}.forma_date`}
                                    component={DateInput}
                                    className={classes.input}
                                />
                            </Grid>
                            <Grid item lg={3} md={6}>
                                <Field
                                    label={formatMessage(MESSAGES.formAComment)}
                                    name={`${accessor}.forma_comment`}
                                    component={MultilineText}
                                    className={classes.input}
                                    debounceTime={1000}
                                />
                            </Grid>
                        </Grid>

                        {/* fourth row: destruction */}
                        <Divider className={customClasses.marginTop} />
                        <Grid item xs={12}>
                            <Box mt={1} mb={1}>
                                <Typography variant="button">
                                    {formatMessage(MESSAGES.destruction)}
                                </Typography>
                            </Box>
                        </Grid>
                        <DestructionsForm accessor={accessor} round={round} />
                    </Grid>
                );
            })}
        </>
    );
};
