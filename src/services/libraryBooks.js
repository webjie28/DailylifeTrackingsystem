// Library books database — full books fetched live from Project Gutenberg
// Cards show only the title; clicking a book opens the full text reader

export const LIBRARY_BOOKS = [
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    genre: 'Gothic Horror',
    gutenbergId: 84,
    textUrl: 'https://www.gutenberg.org/cache/epub/84/pg84.txt'
  },
  {
    id: 'sherlock-holmes',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    genre: 'Mystery',
    gutenbergId: 1661,
    textUrl: 'https://www.gutenberg.org/cache/epub/1661/pg1661.txt'
  },
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    gutenbergId: 1342,
    textUrl: 'https://www.gutenberg.org/cache/epub/1342/pg1342.txt'
  },
  {
    id: 'moby-dick',
    title: 'Moby Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    gutenbergId: 2701,
    textUrl: 'https://www.gutenberg.org/cache/epub/2701/pg2701.txt'
  },
  {
    id: 'dracula',
    title: 'Dracula',
    author: 'Bram Stoker',
    genre: 'Horror',
    gutenbergId: 345,
    textUrl: 'https://www.gutenberg.org/cache/epub/345/pg345.txt'
  },
  {
    id: 'great-gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    gutenbergId: 64317,
    textUrl: 'https://www.gutenberg.org/cache/epub/64317/pg64317.txt'
  },
  {
    id: 'adventures-huckleberry-finn',
    title: 'Adventures of Huckleberry Finn',
    author: 'Mark Twain',
    genre: 'Adventure',
    gutenbergId: 76,
    textUrl: 'https://www.gutenberg.org/cache/epub/76/pg76.txt'
  },
  {
    id: 'alice-in-wonderland',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    genre: 'Fantasy',
    gutenbergId: 11,
    textUrl: 'https://www.gutenberg.org/cache/epub/11/pg11.txt'
  },
  {
    id: 'sherlock-hound-baskervilles',
    title: 'The Hound of the Baskervilles',
    author: 'Arthur Conan Doyle',
    genre: 'Mystery',
    gutenbergId: 2852,
    textUrl: 'https://www.gutenberg.org/cache/epub/2852/pg2852.txt'
  },
  {
    id: 'the-metamorphosis',
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    genre: 'Fiction',
    gutenbergId: 5200,
    textUrl: 'https://www.gutenberg.org/cache/epub/5200/pg5200.txt'
  },
  {
    id: 'war-of-worlds',
    title: 'The War of the Worlds',
    author: 'H.G. Wells',
    genre: 'Science Fiction',
    gutenbergId: 36,
    textUrl: 'https://www.gutenberg.org/cache/epub/36/pg36.txt'
  },
  {
    id: 'time-machine',
    title: 'The Time Machine',
    author: 'H.G. Wells',
    genre: 'Science Fiction',
    gutenbergId: 35,
    textUrl: 'https://www.gutenberg.org/cache/epub/35/pg35.txt'
  },
  {
    id: 'tale-of-two-cities',
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    genre: 'Historical Fiction',
    gutenbergId: 98,
    textUrl: 'https://www.gutenberg.org/cache/epub/98/pg98.txt'
  },
  {
    id: 'oliver-twist',
    title: 'Oliver Twist',
    author: 'Charles Dickens',
    genre: 'Fiction',
    gutenbergId: 730,
    textUrl: 'https://www.gutenberg.org/cache/epub/730/pg730.txt'
  },
  {
    id: 'count-of-monte-cristo',
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    genre: 'Adventure',
    gutenbergId: 1184,
    textUrl: 'https://www.gutenberg.org/cache/epub/1184/pg1184.txt'
  },
  {
    id: 'three-musketeers',
    title: 'The Three Musketeers',
    author: 'Alexandre Dumas',
    genre: 'Adventure',
    gutenbergId: 1257,
    textUrl: 'https://www.gutenberg.org/cache/epub/1257/pg1257.txt'
  },
  {
    id: 'romeo-and-juliet',
    title: 'Romeo and Juliet',
    author: 'William Shakespeare',
    genre: 'Drama',
    gutenbergId: 1112,
    textUrl: 'https://www.gutenberg.org/cache/epub/1112/pg1112.txt'
  },
  {
    id: 'hamlet',
    title: 'Hamlet',
    author: 'William Shakespeare',
    genre: 'Drama',
    gutenbergId: 1524,
    textUrl: 'https://www.gutenberg.org/cache/epub/1524/pg1524.txt'
  },
  {
    id: 'the-picture-of-dorian-gray',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    genre: 'Gothic Fiction',
    gutenbergId: 174,
    textUrl: 'https://www.gutenberg.org/cache/epub/174/pg174.txt'
  },
  {
    id: 'crime-and-punishment',
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    genre: 'Psychological Fiction',
    gutenbergId: 2554,
    textUrl: 'https://www.gutenberg.org/cache/epub/2554/pg2554.txt'
  },
  {
    id: 'invisible-man',
    title: 'The Invisible Man',
    author: 'H.G. Wells',
    genre: 'Science Fiction',
    gutenbergId: 5230,
    textUrl: 'https://www.gutenberg.org/cache/epub/5230/pg5230.txt'
  },
  {
    id: 'treasure-island',
    title: 'Treasure Island',
    author: 'Robert Louis Stevenson',
    genre: 'Adventure',
    gutenbergId: 120,
    textUrl: 'https://www.gutenberg.org/cache/epub/120/pg120.txt'
  },
  {
    id: 'call-of-wild',
    title: 'The Call of the Wild',
    author: 'Jack London',
    genre: 'Adventure',
    gutenbergId: 215,
    textUrl: 'https://www.gutenberg.org/cache/epub/215/pg215.txt'
  },
  {
    id: 'peter-pan',
    title: 'Peter Pan',
    author: 'J.M. Barrie',
    genre: 'Fantasy',
    gutenbergId: 16,
    textUrl: 'https://www.gutenberg.org/cache/epub/16/pg16.txt'
  },
  {
    id: 'around-world-80-days',
    title: 'Around the World in 80 Days',
    author: 'Jules Verne',
    genre: 'Adventure',
    gutenbergId: 103,
    textUrl: 'https://www.gutenberg.org/cache/epub/103/pg103.txt'
  },
  {
    id: 'twenty-thousand-leagues',
    title: 'Twenty Thousand Leagues Under the Sea',
    author: 'Jules Verne',
    genre: 'Science Fiction',
    gutenbergId: 164,
    textUrl: 'https://www.gutenberg.org/cache/epub/164/pg164.txt'
  },
  {
    id: 'don-quixote',
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    genre: 'Classic Literature',
    gutenbergId: 996,
    textUrl: 'https://www.gutenberg.org/cache/epub/996/pg996.txt'
  },
  {
    id: 'anna-karenina',
    title: 'Anna Karenina',
    author: 'Leo Tolstoy',
    genre: 'Fiction',
    gutenbergId: 1399,
    textUrl: 'https://www.gutenberg.org/cache/epub/1399/pg1399.txt'
  },
  {
    id: 'brothers-karamazov',
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    genre: 'Philosophical Fiction',
    gutenbergId: 28054,
    textUrl: 'https://www.gutenberg.org/cache/epub/28054/pg28054.txt'
  },
  {
    id: 'sense-and-sensibility',
    title: 'Sense and Sensibility',
    author: 'Jane Austen',
    genre: 'Romance',
    gutenbergId: 161,
    textUrl: 'https://www.gutenberg.org/cache/epub/161/pg161.txt'
  }
];

/**
 * Fetch and parse the raw full text of a book from Gutenberg.
 * Tries multiple CORS proxies in sequence until one works.
 */
export async function fetchBookText(textUrl) {
  // List of CORS proxy wrappers to try in order
  const proxyBuilders = [
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ]

  let raw = null
  let lastError = null

  for (const buildProxy of proxyBuilders) {
    try {
      const proxyUrl = buildProxy(textUrl)
      const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const text = await response.text()
      // Sanity check: must look like a real book (has some Gutenberg marker or decent length)
      if (text.length > 1000) {
        raw = text
        break
      }
    } catch (e) {
      lastError = e
    }
  }

  if (!raw) throw new Error(lastError?.message || 'All proxies failed.')

  // Strip Gutenberg header (everything before *** START OF THE PROJECT GUTENBERG EBOOK ***)
  const startMarker = raw.indexOf('*** START OF THE PROJECT GUTENBERG EBOOK')
  const endMarker = raw.indexOf('*** END OF THE PROJECT GUTENBERG EBOOK')
  let body = raw
  if (startMarker !== -1) {
    const startIdx = raw.indexOf('\n', startMarker) + 1
    body = endMarker !== -1 ? raw.slice(startIdx, endMarker) : raw.slice(startIdx)
  }

  // Normalize line endings, split into paragraphs separated by blank lines
  body = body.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const paragraphs = body
    .split(/\n{2,}/)
    .map(p => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(p => p.length > 20)

  return paragraphs
}
