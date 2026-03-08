const MovieApi = {
    getOngoingMovies: async () => {
        let api = "http://localhost:8080/api/movies/public";
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    },
    getUpcomingMovies: async () => {
        let api = "http://localhost:8080/api/movies/public/upcoming";
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    },
    getMovieById: async (id) => {
        let api = `http://localhost:8080/api/movies/public/${id}`;
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    },
    getShowtimesByMovie: async (moviedId) => {
        let api = `http://localhost:8080/api/showtimes/public/${moviedId}`;
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        return json.data;
    }
}
export default MovieApi;