module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/_redirects");
    eleventyConfig.addPassthroughCopy({"src/_includes/assets/" : "assets/" });
    eleventyConfig.addPassthroughCopy({"src/demos/" : "demos/" });
    eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));
    
    eleventyConfig.addFilter('dateIso', date => {
      return date.toISOString();
    });
  
    eleventyConfig.addFilter('dateReadable', date => {
      return date.toLocaleDateString();
    });

    return {
        dir: {
            input: "src",
            output: "_output",
        },
        "dataTemplateEngine": "njk"
    }
}

function extractExcerpt(article) {
    if (!article.hasOwnProperty('templateContent')) {
      console.warn('Failed to extract excerpt: Document has no property "templateContent".');
      return null;
    }
   
    let excerpt = null;
    const content = article.templateContent;
   
    // The start and end separators to try and match to extract the excerpt
    const separatorsList = [
      { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
      { start: '<p>', end: '</p>' }
    ];
   
    separatorsList.some(separators => {
      const startPosition = content.indexOf(separators.start);
      const endPosition = content.indexOf(separators.end);
   
      if (startPosition !== -1 && endPosition !== -1) {
        excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
        return true; // Exit out of array loop on first match
      }
    });
   
    return excerpt;
  }