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
        } else if (tag === 'font' || tag === 'size' || tag === 'style') {
          return this.parseFont(match);
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
    // Extract image attributes from img tag
    const imgMatch = tag.match(/\[img(?:\s+([^]+?))?\](.*?)\[\/img\]/);
    if (imgMatch) {
      let attributes = '';
      if (imgMatch[1]) {
        attributes = imgMatch[1].trim();
      }
      let imgTag = '<img ';
      if (attributes) {
        const widthMatch = attributes.match(/width=["']?(\d+)["']?/);
        if (widthMatch && widthMatch[1]) {
          imgTag += `width="${widthMatch[1]}" `;
        }
        const heightMatch = attributes.match(/height=["']?(\d+)["']?/);
        if (heightMatch && heightMatch[1]) {
          imgTag += `height="${heightMatch[1]}" `;
        }
        const altMatch = attributes.match(/alt=["']?([^"'\]]+)["']?/);
        if (altMatch && altMatch[1]) {
          imgTag += `alt="${altMatch[1]}" `;
        }
        const titleMatch = attributes.match(/title=["']?([^"'\]]+)["']?/);
        if (titleMatch && titleMatch[1]) {
          imgTag += `title="${titleMatch[1]}" `;
        }
      }
      imgTag += `src="${imgMatch[2]}" />`;
      return imgTag;
    } else {
      return tag; // Return the original tag if no match is found
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

  parseFont(tag) {
    // Extract font attributes from font tag
    const fontMatch = tag.match(/\[(font|size|style)(?:\s+([^]+?))?\](.*?)\[\/\1\]/);
    if (fontMatch) {
      let attributes = '';
      if (fontMatch[2]) {
        attributes = fontMatch[2].trim();
      }
      let fontTag = '<span ';
      if (attributes) {
        const colorMatch = attributes.match(/color=["']?([^"'\]]+)["']?/);
        if (colorMatch && colorMatch[1]) {
          fontTag += `style="color:${colorMatch[1]};" `;
        }
        const sizeMatch = attributes.match(/size=["']?([^"'\]]+)["']?/);
        if (sizeMatch && sizeMatch[1]) {
          fontTag += `style="font-size:${sizeMatch[1]};" `;
        }
        const styleMatch = attributes.match(/style=["']?([^"'\]]+)["']?/);
        if (styleMatch && styleMatch[1]) {
          fontTag += `${styleMatch[1]} `;
        }
      }
      fontTag += `>${fontMatch[3]}</span>`;
      return fontTag;
    } else {
      return tag; // Return the original tag if no match is found
    }
  }
}

module.exports = BBCodeParser; // For use in Node.js

// Example usage:
// const parser = new BBCodeParser();
// const html = parser.parse("[b]Bold text[/b] and [i]italic text[/i].\nNew line.");
// console.log(html);
