import { Grid, Box, Typography, makeStyles, Divider } from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect, useMemo } from 'react';
import {
    // @ts-ignore
    commonStyles,
    // @ts-ignore
    useSafeIntl,
    // @ts-ignore
    useSkipEffectOnMount,
} from 'bluesquare-components';

import InputComponent from '../../../components/forms/InputComponent';
import { ColorPicker } from '../../../components/forms/ColorPicker';
import { SearchFilter } from '../../../components/filters/Search';
import { OrgUnitTreeviewModal } from './TreeView/OrgUnitTreeviewModal';
import { LocationLimit } from '../../../utils/map/LocationLimit';
import DatesRange from '../../../components/filters/DatesRange';

import { getChipColors } from '../../../constants/chipColors';

import { useGetGroups } from '../hooks/requests/useGetGroups';
import { useGetDataSources } from '../hooks/requests/useGetDataSources';
import { useCurrentUser } from '../../../utils/usersUtils';
import { useGetOrgUnit } from './TreeView/requests';

import { IntlFormatMessage } from '../../../types/intl';
import { OrgUnitParams } from '../types/orgUnit';
import { Search } from '../types/search';
import { DropdownOptions } from '../../../types/utils';

import MESSAGES from '../messages';

type Props = {
    searches: [Search];
    searchIndex: number;
    currentSearch: Search;
    // eslint-disable-next-line no-unused-vars
    setTextSearchError: (hasError: boolean) => void;
    onSearch: () => void;
    // eslint-disable-next-line no-unused-vars
    onChangeColor: (color: string, index: number) => void;
    setSearches: React.Dispatch<React.SetStateAction<[Search]>>;
    currentTab: string;
    params: OrgUnitParams;
    setHasLocationLimitError: React.Dispatch<React.SetStateAction<boolean>>;
    orgunitTypes: DropdownOptions<string>[];
    isFetchingOrgunitTypes: boolean;
};

const retrieveSourceFromVersionId = (versionId, dataSources) => {
    const idAsNumber = parseInt(versionId, 10);
    const result = dataSources.find(
        src =>
            src.original.versions.filter(
                srcVersion => srcVersion.id === idAsNumber,
            ).length > 0,
    );
    return result?.id;
};
const useStyles = makeStyles(theme => ({
    ...commonStyles(theme),
}));

export const OrgUnitFilters: FunctionComponent<Props> = ({
    searches,
    searchIndex,
    currentSearch,
    onSearch,
    onChangeColor,
    setTextSearchError,
    setSearches,
    currentTab,
    params,
    setHasLocationLimitError,
    orgunitTypes,
    isFetchingOrgunitTypes,
}) => {
    const classes: Record<string, string> = useStyles();
    const { formatMessage }: { formatMessage: IntlFormatMessage } =
        useSafeIntl();
    const currentUser = useCurrentUser();

    const [dataSourceId, setDataSourceId] = useState<number | undefined>();
    const [sourceVersionId, setSourceVersionId] = useState<
        number | undefined
    >();
    const [initialOrgUnitId, setInitialOrgUnitId] = useState<
        string | undefined
    >(currentSearch?.levels);
    const [filters, setFilters] = useState<Record<string, any>>(currentSearch);
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

    const { data: initialOrgUnit } = useGetOrgUnit(initialOrgUnitId);

    const { data: dataSources, isFetching: isFetchingDataSources } =
        useGetDataSources();
    const { data: groups, isFetching: isFetchingGroups } = useGetGroups({
        dataSourceId,
        sourceVersionId,
    });
    const handleChange = (key, value) => {
        if (key === 'version') {
            setSourceVersionId(parseInt(value, 10));
        }
        if (key === 'source') {
            setInitialOrgUnitId(undefined);
            setSourceVersionId(undefined);
            setDataSourceId(parseInt(value, 10));
        }
        if (key === 'levels') {
            setInitialOrgUnitId(value);
        }
        const newFilters: Record<string, unknown> = {
            ...filters,
            [key]: value,
        };
        if (newFilters.source && newFilters.version) {
            delete newFilters.source;
        }
        setFilters(newFilters);
        const tempSearches: [Record<string, unknown>] = [...searches];
        tempSearches[searchIndex] = newFilters;
        setSearches(tempSearches);
    };
    const currentColor = filters?.color
        ? `#${filters.color}`
        : getChipColors(searchIndex);

    // Splitting this effect from the one below, so we can use the deps array
    useEffect(() => {
        // we may have a sourceVersionId but no dataSourceId if using deep linking
        // in that case we retrieve the dataSourceId so we can display it
        if (
            dataSources &&
            !dataSourceId &&
            !sourceVersionId &&
            filters?.version &&
            !filters?.group
        ) {
            const id = retrieveSourceFromVersionId(
                filters?.version,
                dataSources,
            );
            setDataSourceId(id);
            setSourceVersionId(parseInt(filters?.version, 10));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSourceId, dataSources, filters?.version]);

    useEffect(() => {
        // if no dataSourceId or sourceVersionId are provided, use the default from user
        if (
            !dataSourceId &&
            !sourceVersionId &&
            !filters?.version &&
            currentUser?.account?.default_version?.data_source?.id &&
            !filters?.group
        ) {
            // TO-DO => IA-1491 when coming from groups page, we need to prefill source and version from the selected group !
            setDataSourceId(
                filters?.source ??
                    currentUser?.account?.default_version?.data_source?.id,
            );
            setSourceVersionId(
                filters?.version ?? currentUser?.account?.default_version?.id,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Set the version to the dataSources default version when changing source
    useEffect(() => {
        if (dataSourceId) {
            const dataSource = dataSources?.find(
                src => src?.original?.id === dataSourceId,
            );
            if (
                dataSource &&
                !dataSource.original?.versions.find(
                    version => version.id === sourceVersionId,
                )
            ) {
                const selectedVersion =
                    dataSource?.original?.default_version?.id;
                setSourceVersionId(selectedVersion);
            }
        }
    }, [dataSourceId, sourceVersionId, dataSources]);

    useSkipEffectOnMount(() => {
        if (filters !== currentSearch) {
            setFilters(currentSearch);
        }
    }, [currentSearch]);
    const versionsDropDown = useMemo(() => {
        if (!dataSources || !dataSourceId) return [];
        return (
            dataSources
                .filter(src => src.original?.id === dataSourceId)[0]
                ?.original?.versions.sort((a, b) => a.number - b.number)
                .map(version => ({
                    label: version.number.toString(),
                    value: version.id.toString(),
                })) ?? []
        );
    }, [dataSourceId, dataSources]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Box mt={4} mb={4}>
                    <ColorPicker
                        currentColor={currentColor}
                        onChangeColor={color =>
                            onChangeColor(color, searchIndex)
                        }
                    />
                </Box>
                <SearchFilter
                    withMarginTop
                    uid={`search-${searchIndex}`}
                    onEnterPressed={() => onSearch()}
                    onChange={handleChange}
                    keyValue="search"
                    value={filters?.search ? `${filters?.search}` : ''}
                    onErrorChange={setTextSearchError}
                />
                <InputComponent
                    type="select"
                    disabled={isFetchingDataSources}
                    keyValue="source"
                    onChange={handleChange}
                    value={!isFetchingDataSources && dataSourceId}
                    label={MESSAGES.source}
                    options={dataSources}
                    loading={isFetchingDataSources}
                />
                {!showAdvancedSettings && (
                    <Typography
                        className={classes.advancedSettings}
                        variant="overline"
                        onClick={() => setShowAdvancedSettings(true)}
                    >
                        {formatMessage(MESSAGES.showAdvancedSettings)}
                    </Typography>
                )}
                {showAdvancedSettings && (
                    <>
                        <InputComponent
                            type="select"
                            disabled={isFetchingOrgunitTypes}
                            keyValue="version"
                            onChange={handleChange}
                            value={sourceVersionId}
                            label={MESSAGES.sourceVersion}
                            options={versionsDropDown}
                            clearable={false}
                            loading={isFetchingOrgunitTypes}
                        />
                        <Typography
                            className={classes.advancedSettings}
                            variant="overline"
                            onClick={() => setShowAdvancedSettings(false)}
                        >
                            {formatMessage(MESSAGES.hideAdvancedSettings)}
                        </Typography>
                    </>
                )}
            </Grid>

            <Grid item xs={4}>
                <InputComponent
                    type="select"
                    multi
                    disabled={isFetchingOrgunitTypes}
                    keyValue="orgUnitTypeId"
                    onChange={handleChange}
                    value={!isFetchingOrgunitTypes && filters?.orgUnitTypeId}
                    label={MESSAGES.org_unit_type}
                    options={orgunitTypes}
                    loading={isFetchingOrgunitTypes}
                />
                <InputComponent
                    type="select"
                    multi
                    disabled={isFetchingGroups}
                    keyValue="group"
                    onChange={handleChange}
                    value={!isFetchingGroups && filters?.group}
                    label={MESSAGES.group}
                    options={groups}
                    loading={isFetchingGroups}
                />
                <InputComponent
                    type="select"
                    keyValue="validation_status"
                    onChange={handleChange}
                    value={filters?.validation_status}
                    label={MESSAGES.validationStatus}
                    options={[
                        {
                            label: formatMessage(MESSAGES.all),
                            value: 'all',
                        },
                        {
                            label: formatMessage(MESSAGES.new),
                            value: 'NEW',
                        },
                        {
                            label: formatMessage(MESSAGES.validated),
                            value: 'VALID',
                        },
                        {
                            label: formatMessage(MESSAGES.rejected),
                            value: 'REJECTED',
                        },
                    ]}
                />

                {currentTab === 'map' && (
                    <>
                        <Divider />
                        <Box mt={2}>
                            <LocationLimit
                                keyValue="locationLimit"
                                onChange={handleChange}
                                value={params.locationLimit}
                                setHasError={setHasLocationLimitError}
                            />
                        </Box>
                    </>
                )}
            </Grid>

            <Grid item xs={4}>
                <Box mb={1}>
                    <OrgUnitTreeviewModal
                        toggleOnLabelClick={false}
                        titleMessage={MESSAGES.parent}
                        onConfirm={orgUnit => {
                            // TODO rename levels in to parent
                            handleChange('levels', orgUnit?.id);
                        }}
                        source={dataSourceId}
                        version={sourceVersionId}
                        initialSelection={initialOrgUnit}
                    />
                </Box>
                <Box mb={2}>
                    <InputComponent
                        type="select"
                        keyValue="geography"
                        onChange={handleChange}
                        value={filters?.geography}
                        label={MESSAGES.geographicalData}
                        options={[
                            {
                                label: formatMessage(MESSAGES.anyGeography),
                                value: 'any',
                            },
                            {
                                label: formatMessage(MESSAGES.withLocation),
                                value: 'location',
                            },
                            {
                                label: formatMessage(MESSAGES.withShape),
                                value: 'shape',
                            },
                            {
                                label: formatMessage(
                                    MESSAGES.noGeographicalData,
                                ),
                                value: 'none',
                            },
                        ]}
                    />
                </Box>
                <Divider />
                <Box mt={1}>
                    <InputComponent
                        type="select"
                        keyValue="hasInstances"
                        onChange={handleChange}
                        value={filters?.hasInstances}
                        label={MESSAGES.hasInstances}
                        options={[
                            {
                                label: formatMessage(MESSAGES.with),
                                value: 'true',
                            },
                            {
                                label: formatMessage(MESSAGES.without),
                                value: 'false',
                            },
                            {
                                label: formatMessage(MESSAGES.duplicates),
                                value: 'duplicates',
                            },
                        ]}
                    />
                </Box>
                {(filters?.hasInstances === 'true' ||
                    filters?.hasInstances === 'duplicates') && (
                    <DatesRange
                        onChangeDate={handleChange}
                        dateFrom={filters?.dateFrom}
                        dateTo={filters?.dateTo}
                    />
                )}
            </Grid>
        </Grid>
    );
};
