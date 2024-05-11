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
    const bbRegex = /\[(\/?[^\]]+?)\]/g;

    // Replace BBCode tags with their corresponding HTML tags
    let html = input.replace(bbRegex, (match, tag) => {
      if (tag.startsWith('/')) {
        // Closing tag
        const openTag = tag.substring(1);
        return `</${this.tags[openTag]}>`;
      } else {
        // Opening tag
        if (tag === 'img') {
          return this.parseImg(match);
        } else if (tag === 'url') {
          return this.parseUrl(match);
        } else {
          return `<${this.tags[tag]}>`;
        }
      }
    });

    // Replace newlines with <br> tags
    html = html.replace(/\n/g, "<br>");

    return html;
  }

  parseImg(tag) {
    // Extract URL from img tag
    const urlMatch = tag.match(/\[img\](.*?)\[\/img\]/);
    if (urlMatch && urlMatch[1]) {
      return `<img src="${urlMatch[1]}" />`;
    } else {
      return tag; // Return the original tag if URL is not found
    }
  }

  parseUrl(tag) {
    // Extract URL and text from url tag
    const urlMatch = tag.match(/\[url=(.*?)\](.*?)\[\/url\]/);
    if (urlMatch && urlMatch[1]) {
      return `<a href="${urlMatch[1]}">${urlMatch[2]}</a>`;
    } else {
      // If URL is not specified, treat it as a regular URL tag
      const urlMatchWithoutText = tag.match(/\[url\](.*?)\[\/url\]/);
      if (urlMatchWithoutText && urlMatchWithoutText[1]) {
        return `<a href="${urlMatchWithoutText[1]}">${urlMatchWithoutText[1]}</a>`;
      } else {
        return tag; // Return the original tag if URL is not found
      }
    }
  }
}

module.exports = BBCodeParser; // For use in Node.js

// Example usage:
// const parser = new BBCodeParser();
// const html = parser.parse("[b]Bold text[/b] and [i]italic text[/i].\nNew line.");
// console.log(html);
