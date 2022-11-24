export default async function fetchCurrentLabelsCount(issues: boolean) {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('accessToken') as string,
            },
        };
        let endpoint = 'countLabel';
        if (issues) {
            endpoint = 'countIssue';
        }
        const response = await fetch(process.env.REACT_APP_BASE_URL + `/${endpoint}`, requestOptions);
        const currentLabelsCount = response.json();
        return currentLabelsCount;
    } catch (err) {
        throw new Error(err as string);
    }
}
