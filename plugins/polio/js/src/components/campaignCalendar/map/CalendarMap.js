import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { LoadingSpinner } from 'bluesquare-components';
import { FormattedMessage } from 'react-intl';
import { Box } from '@material-ui/core';
import { GeoJSON, Map, Pane, TileLayer, Tooltip } from 'react-leaflet';
import { useQueries } from 'react-query';
import { getRequest } from 'Iaso/libs/Api';
import { polioVacines } from '../../../constants/virus';

import { VaccinesLegend } from './VaccinesLegend';
import { CampaignsLegend } from './CampaignsLegend';
import MESSAGES from '../../../constants/messages';
import { appId } from '../../../constants/app';
import { useStyles } from '../Styles';

import 'leaflet/dist/leaflet.css';

const CalendarMap = ({ campaigns, loadingCampaigns }) => {
    const classes = useStyles();
    const map = useRef();
    console.log('campaigns', campaigns);
    const shapesQueries = useQueries(
        campaigns
            .filter(c => Boolean(c.original.group?.id))
            .map(campaign => {
                const baseParams = {
                    asLocation: true,
                    limit: 3000,
                    group: campaign.original.group.id,
                    app_id: appId,
                };

                const queryString = new URLSearchParams(baseParams);
                return {
                    queryKey: ['campaignShape', baseParams],
                    queryFn: () =>
                        getRequest(`/api/orgunits/?${queryString.toString()}`),
                    select: data => ({
                        campaign,
                        vacine: polioVacines.find(
                            v => v.value === campaign.original.vacine,
                        ),
                        shapes: data,
                    }),
                    enabled: !loadingCampaigns,
                };
            }),
    );

    const regions = useQueries(
        campaigns
            .filter(c => Boolean(c.original.group?.id))
            .map(campaign => {
                const baseParams = {
                    order: 'id',
                    page: 1,
                    searchTabIndex: 0,
                    limit: 1000,
                    // eslint-disable-next-line max-len
                    searches: `[{"validation_status":"all","color":"f4511e","source":2,"levels":${campaign.country_id.toString()},"orgUnitTypeId":"6","orgUnitParentId":${campaign.country_id.toString()},"dateFrom":null,"dateTo":null}]`,
                };
                const queryString = new URLSearchParams(baseParams);
                console.log('queryString', queryString);
                return {
                    queryKey: ['campaignRegion', queryString],
                    queryFn: () =>
                        getRequest(`/api/orgunits/?${queryString.toString()}`),
                    select: data => ({
                        campaign_id: campaign.id,
                        campaign_country: campaign.country,
                        campaign_country_id: campaign.country_id,
                        regions: data,
                    }),
                };
            }),
    );
    console.log(regions);
    const loadingShapes = shapesQueries.some(q => q.isLoading);
    const campaignsShapes = shapesQueries
        .filter(sq => sq.data)
        .map(sq => sq.data);
    console.log('campaignShapes', campaignsShapes);
    return (
        <Box position="relative">
            {(loadingCampaigns || loadingShapes) && <LoadingSpinner absolute />}
            <div className={classes.mapLegend}>
                <CampaignsLegend campaigns={campaignsShapes} />
                <Box display="flex" justifyContent="flex-end">
                    <VaccinesLegend />
                </Box>
            </div>
            <Map
                zoomSnap={0.25}
                ref={map}
                style={{ height: '72vh' }}
                center={[1, 20]}
                zoom={3.25}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {campaignsShapes.map(cs => {
                    return (
                        <Pane
                            name={`campaign-${cs.campaign.id}`}
                            key={cs.campaign.id}
                        >
                            {cs.shapes.map(shape => (
                                <GeoJSON
                                    key={shape.id}
                                    data={shape.geo_json}
                                    style={() => {
                                        return {
                                            color: cs.campaign.color,
                                            opacity: 0.6,
                                            fillOpacity: 0.6,
                                            fillColor: cs.vacine?.color,
                                            weight: '2',
                                        };
                                    }}
                                >
                                    <Tooltip>
                                        <div>
                                            <FormattedMessage
                                                {...MESSAGES.campaign}
                                            />
                                            {`: ${cs.campaign.name}`}
                                        </div>
                                        <div>
                                            <FormattedMessage
                                                {...MESSAGES.country}
                                            />
                                            {`: ${cs.campaign.country}`}
                                        </div>
                                        <div>
                                            <FormattedMessage
                                                {...MESSAGES.district}
                                            />
                                            {`: ${shape.name}`}
                                        </div>
                                        <div>
                                            <FormattedMessage
                                                {...MESSAGES.vaccine}
                                            />
                                            {`: ${cs.vacine?.label}`}
                                        </div>
                                    </Tooltip>
                                </GeoJSON>
                            ))}
                        </Pane>
                    );
                })}
            </Map>
        </Box>
    );
};

CalendarMap.propTypes = {
    campaigns: PropTypes.array.isRequired,
    loadingCampaigns: PropTypes.bool.isRequired,
};

export { CalendarMap };
