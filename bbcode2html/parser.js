class BBCodeParser {
  constructor() {
    // Define the supported BBCode tags and their corresponding HTML tags
    this.tags = {
      b: 'strong',
      i: 'em',
      u: 'u'
      // ... more tags soon
    };
  }

  parse(input) {
    // Regular expression to match BBCode tags and their contents
    const bbRegex = /\[([^\]]+?)\]([\s\S]*?)\[\/\1\]/g;

    // Replace BBCode tags with their corresponding HTML tags
    let html = input.replace(bbRegex, (match, tag, content) => {
      // Check if the tag is supported
      if (this.tags[tag]) {
        // Replace the BBCode tag with its HTML equivalent
        return `<${this.tags[tag]}>${content}</${this.tags[tag]}>`;
      } else {
        // If the tag is not supported, return the original text
        return match;
      }
    });

    // Replace newlines with <br> tags
    html = html.replace(/\n/g, "<br>");

    return html;
  }
}

module.exports = BBCodeParser; // For use in Node.js

// Example usage:
// const parser = new BBCodeParser();
// const html = parser.parse("[b]Bold text[/b] and [i]italic text[/i].\nNew line.");
// console.log(html);
