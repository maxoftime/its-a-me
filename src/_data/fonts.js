const EleventyFetch = require("@11ty/eleventy-fetch");

    


module.exports = async function() {
    let url = "https://fonts.googleapis.com/css2?family=Silkscreen&display=swap";
    let fontCss = await EleventyFetch(url, {
        duration: "1d",
        type: "text",
        fetchOptions: {
            headers: {
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
            }
        }
    });
    return fontCss;
};