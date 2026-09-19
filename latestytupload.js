

const API_KEY = "AIzaSyCx0cNptuezbQer0mARYUSozYV_YHBSQk4"; // I'm too lazy, kill me!
const CHANNEL_ID = "UCe-HCl3Mb4c1taGDQrlq5Dw";


// ------------------------------------------
// Get uploads playlist
// ------------------------------------------

async function getUploadsPlaylist() {

    const url =
        "https://www.googleapis.com/youtube/v3/channels" +
        "?part=contentDetails" +
        "&id=" + CHANNEL_ID +
        "&key=" + API_KEY;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        throw new Error("Channel not found.");
    }

    return data.items[0]
        .contentDetails
        .relatedPlaylists
        .uploads;
}


// ------------------------------------------
// Get recent uploads
// ------------------------------------------

async function getRecentVideos(uploadsPlaylistId) {

    const url =
        "https://www.googleapis.com/youtube/v3/playlistItems" +
        "?part=snippet" +
        "&playlistId=" + uploadsPlaylistId +
        "&maxResults=10" +
        "&key=" + API_KEY;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        throw new Error("No videos found.");
    }

    return data.items.map(item =>
        item.snippet.resourceId.videoId
    );
}


// ------------------------------------------
// Get video durations
// ------------------------------------------

async function getVideoDetails(videoIds) {

    const url =
        "https://www.googleapis.com/youtube/v3/videos" +
        "?part=contentDetails" +
        "&id=" + videoIds.join(",") +
        "&key=" + API_KEY;

    const response = await fetch(url);
    const data = await response.json();

    return data.items;
}


// ------------------------------------------
// Convert ISO 8601 duration to seconds
// ------------------------------------------

function durationToSeconds(duration) {

    const match = duration.match(
        /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );

    if (!match) {
        return 0;
    }

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    return hours * 3600 +
            minutes * 60 +
            seconds;
}


// ------------------------------------------
// Find latest non-Short
// ------------------------------------------

async function loadLatestVideo() {

    const loading = document.getElementById("loading");
    const iframe = document.getElementById("latest-video");
    const error = document.getElementById("error");

    try {

        // Get uploads playlist
        const uploadsPlaylist =
            await getUploadsPlaylist();

        // Get the 10 most recent uploads
        const recentVideos =
            await getRecentVideos(uploadsPlaylist);

        // Get their durations
        const videoDetails =
            await getVideoDetails(recentVideos);


        // Find the first video that is longer
        // than 60 seconds
        const normalVideo =
            videoDetails.find(video => {

                const seconds =
                    durationToSeconds(
                        video.contentDetails.duration
                    );

                return seconds > 60;
            });


        if (!normalVideo) {
            throw new Error(
                "No regular videos found."
            );
        }


        // Embed the video
        iframe.src =
            "https://www.youtube.com/embed/" +
            normalVideo.id;


        // Show it
        loading.style.display = "none";
        iframe.style.display = "block";


    } catch (err) {

        console.error(err);

        loading.style.display = "none";
        error.style.display = "block";
    }
}


// ------------------------------------------
// Start
// ------------------------------------------

loadLatestVideo();
