import { useMutation } from 'react-query';
import { sendRequest } from '../utils/networking';

export const useCreateCampaign = () =>
    useMutation(body => sendRequest('POST', '/api/polio/campaigns/', body));
