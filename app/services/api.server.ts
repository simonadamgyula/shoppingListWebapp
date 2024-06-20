const api_url: string = process.env.API_URL ?? 'http://localhost:8001';

export const authenticate = async (username: string | null, password: string | null): Promise<string | null> => {
    console.log(`${api_url}/user/authenticate`)
    try {
        const response = await fetch(`http://${api_url}/user/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })

        if (response.ok) {
            const data = await response.json();
            return data.session_id;
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return null;
}

export const getUser = async (session_id: string): Promise<{ username: string } | null> => {
    try {
        const response = await fetch(`http://${api_url}/user/get_username`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id })
        })

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return { username: data.username };
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return null;
}

export const getHouseholds = async (session_id: string): Promise<Household[] | null> => {
    try {
        const response = await fetch(`http://${api_url}/household`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id })
        })

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data.households;
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return null;
}

export const getJoinCode = async (session_id: string, household_id: number): Promise<string | null> => {
    try {
        const response = await fetch(`http://${api_url}/household/new_code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id, household_id })
        })

        if (response.ok) {
            const data = await response.json();
            return data.code;
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return null;
}

export const joinHousehold = async (session_id: string, household_code: string): Promise<boolean> => {
    try {
        const response = await fetch(`http://${api_url}/household/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id, household_code })
        })

        if (response.ok) {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }

    return false;
}

export const createHousehold = async (session_id: string, household_name: string): Promise<boolean> => {
    try {
        const response = await fetch(`http://${api_url}/household/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id, name: household_name })
        })

        if (response.ok) {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }

    return false;
}