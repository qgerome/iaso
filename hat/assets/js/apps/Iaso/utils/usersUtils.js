import { useSelector } from 'react-redux';

const getDisplayName = user => {
    if (!user.first_name && !user.last_name) {
        return user.user_name;
    }
    return `${user.user_name} (${user.first_name ? `${user.first_name}` : ''}${
        user.first_name && user.last_name ? ' ' : ''
    }${user.last_name ? `${user.last_name}` : ''}) `;
};

export default getDisplayName;

export const useCurrentUser = () => {
    // noinspection UnnecessaryLocalVariableJS
    const currentUser = useSelector(state => state.users.current);
    return currentUser;
};
