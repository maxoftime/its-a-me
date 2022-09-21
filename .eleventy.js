module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({"src/_includes/assets/" : "assets/" });
    return {
        dir: {
            input: "src",
            output: "_output",
        },
        "dataTemplateEngine": "njk"
    }
}