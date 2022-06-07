import { getRequest } from '../../../../../hat/assets/js/apps/Iaso/libs/Api';
import { useSnackQuery } from '../../../../../hat/assets/js/apps/Iaso/libs/apiHooks';
import { makeUrlWithParams } from '../../../../../hat/assets/js/apps/Iaso/libs/utils';
import { UrlParams } from '../../../../../hat/assets/js/apps/Iaso/types/table';

const endpoint = '/api/polio/budgetevent';

type Params = UrlParams;

const getBudgetDetails = (params: Params) => {
    const { pageSize, ...otherParams } = params;
    const urlParams = { ...otherParams, limit: pageSize ?? 10 };
    const url = makeUrlWithParams(endpoint, urlParams);
    return getRequest(url);
};

export const useGetBudgetDetails = (params: Params) => {
    return useSnackQuery(['budget-details', params], () =>
        getBudgetDetails(params),
    );
};
