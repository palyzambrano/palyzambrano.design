import showdown from 'showdown';

const showdownConverter = new showdown.Converter();

/**
 * Retrieves blog posts from GitHub
 * 
 * ```
 * [
 * {
 *   "name": "2020_10_02-1.md",
 *   "path": "blog/2020_10_02-1.md",
 *   "sha": "4256fd824339b99e00bd55b42d6c8b540747a66f",
 *   "size": 3081,
 *   "url": "https://api.github.com/repos/palyzambrano/palyzambrano.github.io/contents/blog/2020_10_02-1.md?ref=main",
 *   "html_url": "https://github.com/palyzambrano/palyzambrano.github.io/blob/main/blog/2020_10_02-1.md",
 *   "git_url": "https://api.github.com/repos/palyzambrano/palyzambrano.github.io/git/blobs/4256fd824339b99e00bd55b42d6c8b540747a66f",
 *   "download_url": "https://raw.githubusercontent.com/palyzambrano/palyzambrano.github.io/main/blog/2020_10_02-1.md",
 *   "type": "file",
 *  "_links": {
 *     "self": "https://api.github.com/repos/palyzambrano/palyzambrano.github.io/contents/blog/2020_10_02-1.md?ref=main",
 *     "git": "https://api.github.com/repos/palyzambrano/palyzambrano.github.io/git/blobs/4256fd824339b99e00bd55b42d6c8b540747a66f",
 *     "html": "https://github.com/palyzambrano/palyzambrano.github.io/blob/main/blog/2020_10_02-1.md"
 *   }
 * }
 * ]
 * ```
 * 
 */
export async function getBlogPosts() {
  try {
    const result = await fetch('https://api.github.com/repos/palyzambrano/palyzambrano.github.io/contents/blog');
    const posts = await result.json();
    const blogPosts = [];

    console.log(posts);

    for (const fileEntry of posts) {
      const fileContents = await getAPIFileContents(fileEntry.name);
     
      blogPosts.push(makePostFromAPIFileContent(fileContents));
    }
  
    return blogPosts;
  } catch (error) {
    console.error('Unable to fetch Blog Posts', error);
    return [];
  }
}

export async function getAPIFileContents(filename) {
  const fileContents = await fetch(`https://raw.githubusercontent.com/palyzambrano/palyzambrano.github.io/main/blog/${filename}`);
  
  return await fileContents.text();
}

export function makePostFromAPIFileContent(pathFileContents) {
  const lines = pathFileContents.split('\n');
  const meta = {};

  let metaTagFound = 0;
  let fileContents = '';

  for (const lineIndex in lines) {
    const line = lines[lineIndex];

    if (line === '---') {
      if (metaTagFound === 0) {
        metaTagFound = 1;
      }

      if (metaTagFound === 1) {
        metaTagFound = 2;
      }
    }

    if (metaTagFound === 1) {
      const [key, value] = line.split(' ');

      meta[key] = value;
    }

    if (metaTagFound === 2) {
      const content = lines.slice(lineIndex, lines.length + 1);
      
      fileContents = content.join('\n');

      break;
    }
  }

  return {
    meta,
    content: showdownConverter.makeHtml(fileContents),
  }
}
