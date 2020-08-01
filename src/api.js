export function postFetch(url){
    return fetch(url)
    .then(res => {
        if (!res.ok) {
            throw new Error("An error occurred")
        }
        return res.json()
    })
    .then(data=>{
        return data;
    })
}

