const api_url: string = process.env.API_URL ?? 'localhost:8001';

const sendRequest = async (url: string, method: string, body: any): Promise<any> => {
    try {
        const response = await fetch(`http://${api_url}${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        console.log(response);

        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return null;
}

export const authenticate = async (username: string | null, password: string | null): Promise<string | null> => {
    const data = await sendRequest('/user/authenticate', 'POST', { username, password });
    if (!data) return data;
    return data.session_id;
}

export const getUser = async (session_id: string): Promise<User | null> => {
    const data = await sendRequest('/user/get_user', 'POST', { session_id });
    return data;
}

export const editUser = async (session_id: string, username: string, profile_picture: string): Promise<boolean> => {
    const data = await sendRequest('/user/edit', 'POST', { session_id, username, profile_picture });
    return data;
}

export const register = async (username: string, password: string, profile_picture: string): Promise<boolean> => {
    const data = await sendRequest('/user/new', 'POST', { username, password, profile_picture });
    return data;
}

export const getHouseholds = async (session_id: string): Promise<Household[] | null> => {
    const data = await sendRequest('/household', 'POST', { session_id });
    if (!data) return data;
    return data.households;
}

export const getJoinCode = async (session_id: string, household_id: number): Promise<string | null> => {
    const data = await sendRequest('/household/new_code', 'POST', { session_id, household_id });
    if (!data) return data;
    return data.code;
}

export const joinHousehold = async (session_id: string, household_code: string): Promise<boolean> => {
    const data = await sendRequest('/household/join', 'POST', { session_id, household_code });
    return data;
}

export const createHousehold = async (session_id: string, household_name: string, color: number): Promise<boolean> => {
    const data = await sendRequest('/household/new', 'POST', { session_id, name: household_name, color });
    return data;
}

export const leaveHousehold = async (session_id: string, household_id: number): Promise<boolean> => {
    const data = await sendRequest('/household/leave', 'POST', { session_id, household_id });
    return data;
}

export const getHousehold = async (session_id: string, household_id: number): Promise<Household | null> => {
    const data = await sendRequest('/household/get', 'POST', { session_id, household_id });
    if (!data) return data;
    return { name: data.name, id: household_id, color: data.color };
}

export const getItems = async (session_id: string, household_id: number): Promise<Item[] | null> => {
    const data = await sendRequest('/household/items', 'POST', { session_id, household: household_id });
    if (!data) return data;
    return JSON.parse(data.items) as Item[];
}

export const addItem = async (session_id: string, household_id: number, item: Item): Promise<boolean> => {
    const data = await sendRequest('/household/items/add', 'POST', { session_id, household_id, item });
    return data;
}

export const removeItem = async (session_id: string, household_id: number, item: Item): Promise<boolean> => {
    const data = await sendRequest('/household/items/remove', 'POST', { session_id, household_id, item: item.name });
    return data;
}

export const itemSetBought = async (session_id: string, household_id: number, item: string, bought: boolean): Promise<boolean> => {
    const data = await sendRequest('/household/items/set_bought', 'POST', { session_id, household_id, item, bought: bought });
    return data;
}

export const getHouseholdUsers = async (session_id: string, household_id: number): Promise<User[] | null> => {
    const data = await sendRequest('/household/get_users', 'POST', { session_id, household_id });
    if (!data) return data;
    return data.users;
}

export const checkHouseholdAdmin = async (session_id: string, household_id: number): Promise<boolean> => {
    const data = await sendRequest('/household/check_admin', 'POST', { session_id, household_id });
    if (!data) return data;
    return data.is_admin;
}

export const editHousehold = async (session_id: string, household_id: number, name: string, color: number): Promise<boolean> => {
    const data = await sendRequest('/household/update', 'POST', { session_id, household_id, new_name: name, new_color: color });
    return data;
}

export const setPermission = async (session_id: string, household_id: number, user_id: string, permissions: string): Promise<boolean> => {
    const data = await sendRequest('/household/set_permissions', 'POST', { session_id, household_id, user_id, permissions });
    return data;
}

export const kickMember = async (session_id: string, household_id: number, user_id: string): Promise<boolean> => {
    const data = await sendRequest('/household/kick_member', 'POST', { session_id, household_id, user_id });
    return data;
}

export const deleteAccount = async (session_id: string): Promise<boolean> => {
    const data = await sendRequest('/user/delete', 'POST', { session_id });
    return data;
}