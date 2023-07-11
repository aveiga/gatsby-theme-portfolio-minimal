module.exports = {
    VideoListingQuery: `
        query VideoListingQuery {
            allYoutubeVideo {
                edges {
                node {
                    id
                    title
                    description
                    videoId
                    publishedAt
                    privacyStatus
                    channelTitle
                    thumbnail
                }
                }
            }
        }  
    `,
};
