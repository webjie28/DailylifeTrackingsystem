// Library books database — full books fetched live from Project Gutenberg
// Cards show only the title; clicking a book opens the full text reader

export const LIBRARY_BOOKS = [
  // --- ROMANCE ---
  { id: 'pride-and-prejudice', title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', gutenbergId: 1342, textUrl: 'https://www.gutenberg.org/cache/epub/1342/pg1342.txt' },
  { id: 'sense-and-sensibility', title: 'Sense and Sensibility', author: 'Jane Austen', genre: 'Romance', gutenbergId: 161, textUrl: 'https://www.gutenberg.org/cache/epub/161/pg161.txt' },
  { id: 'emma', title: 'Emma', author: 'Jane Austen', genre: 'Romance', gutenbergId: 158, textUrl: 'https://www.gutenberg.org/cache/epub/158/pg158.txt' },
  { id: 'persuasion', title: 'Persuasion', author: 'Jane Austen', genre: 'Romance', gutenbergId: 105, textUrl: 'https://www.gutenberg.org/cache/epub/105/pg105.txt' },
  { id: 'mansfield-park', title: 'Mansfield Park', author: 'Jane Austen', genre: 'Romance', gutenbergId: 141, textUrl: 'https://www.gutenberg.org/cache/epub/141/pg141.txt' },
  { id: 'northanger-abbey', title: 'Northanger Abbey', author: 'Jane Austen', genre: 'Romance', gutenbergId: 121, textUrl: 'https://www.gutenberg.org/cache/epub/121/pg121.txt' },
  { id: 'jane-eyre', title: 'Jane Eyre', author: 'Charlotte Brontë', genre: 'Romance', gutenbergId: 1263, textUrl: 'https://www.gutenberg.org/cache/epub/1263/pg1263.txt' },
  { id: 'wuthering-heights', title: 'Wuthering Heights', author: 'Emily Brontë', genre: 'Romance', gutenbergId: 768, textUrl: 'https://www.gutenberg.org/cache/epub/768/pg768.txt' },
  { id: 'tess-of-the-durbervilles', title: 'Tess of the d\'Urbervilles', author: 'Thomas Hardy', genre: 'Romance', gutenbergId: 110, textUrl: 'https://www.gutenberg.org/cache/epub/110/pg110.txt' },
  { id: 'far-from-the-madding-crowd', title: 'Far from the Madding Crowd', author: 'Thomas Hardy', genre: 'Romance', gutenbergId: 27, textUrl: 'https://www.gutenberg.org/cache/epub/27/pg27.txt' },
  { id: 'the-age-of-innocence', title: 'The Age of Innocence', author: 'Edith Wharton', genre: 'Romance', gutenbergId: 541, textUrl: 'https://www.gutenberg.org/cache/epub/541/pg541.txt' },
  { id: 'the-house-of-mirth', title: 'The House of Mirth', author: 'Edith Wharton', genre: 'Romance', gutenbergId: 284, textUrl: 'https://www.gutenberg.org/cache/epub/284/pg284.txt' },
  { id: 'lady-chatterleys-lover', title: 'Lady Chatterley\'s Lover', author: 'D. H. Lawrence', genre: 'Romance', gutenbergId: 63606, textUrl: 'https://www.gutenberg.org/cache/epub/63606/pg63606.txt' },
  { id: 'romeo-and-juliet', title: 'Romeo and Juliet', author: 'William Shakespeare', genre: 'Romance', gutenbergId: 1112, textUrl: 'https://www.gutenberg.org/cache/epub/1112/pg1112.txt' },
  { id: 'the-tenant-of-wildfell-hall', title: 'The Tenant of Wildfell Hall', author: 'Anne Brontë', genre: 'Romance', gutenbergId: 969, textUrl: 'https://www.gutenberg.org/cache/epub/969/pg969.txt' },
  { id: 'anna-karenina', title: 'Anna Karenina', author: 'Leo Tolstoy', genre: 'Romance', gutenbergId: 1399, textUrl: 'https://www.gutenberg.org/cache/epub/1399/pg1399.txt' },

  // --- ADVENTURE ---
  { id: 'moby-dick', title: 'Moby Dick', author: 'Herman Melville', genre: 'Adventure', gutenbergId: 2701, textUrl: 'https://www.gutenberg.org/cache/epub/2701/pg2701.txt' },
  { id: 'adventures-huckleberry-finn', title: 'Adventures of Huckleberry Finn', author: 'Mark Twain', genre: 'Adventure', gutenbergId: 76, textUrl: 'https://www.gutenberg.org/cache/epub/76/pg76.txt' },
  { id: 'adventures-of-tom-sawyer', title: 'The Adventures of Tom Sawyer', author: 'Mark Twain', genre: 'Adventure', gutenbergId: 74, textUrl: 'https://www.gutenberg.org/cache/epub/74/pg74.txt' },
  { id: 'treasure-island', title: 'Treasure Island', author: 'Robert Louis Stevenson', genre: 'Adventure', gutenbergId: 120, textUrl: 'https://www.gutenberg.org/cache/epub/120/pg120.txt' },
  { id: 'kidnapped', title: 'Kidnapped', author: 'Robert Louis Stevenson', genre: 'Adventure', gutenbergId: 1104, textUrl: 'https://www.gutenberg.org/cache/epub/1104/pg1104.txt' },
  { id: 'call-of-wild', title: 'The Call of the Wild', author: 'Jack London', genre: 'Adventure', gutenbergId: 215, textUrl: 'https://www.gutenberg.org/cache/epub/215/pg215.txt' },
  { id: 'white-fang', title: 'White Fang', author: 'Jack London', genre: 'Adventure', gutenbergId: 910, textUrl: 'https://www.gutenberg.org/cache/epub/910/pg910.txt' },
  { id: 'the-sea-wolf', title: 'The Sea-Wolf', author: 'Jack London', genre: 'Adventure', gutenbergId: 1074, textUrl: 'https://www.gutenberg.org/cache/epub/1074/pg1074.txt' },
  { id: 'around-world-80-days', title: 'Around the World in 80 Days', author: 'Jules Verne', genre: 'Adventure', gutenbergId: 103, textUrl: 'https://www.gutenberg.org/cache/epub/103/pg103.txt' },
  { id: 'journey-to-center-of-earth', title: 'Journey to the Center of the Earth', author: 'Jules Verne', genre: 'Adventure', gutenbergId: 18857, textUrl: 'https://www.gutenberg.org/cache/epub/18857/pg18857.txt' },
  { id: 'the-mysterious-island', title: 'The Mysterious Island', author: 'Jules Verne', genre: 'Adventure', gutenbergId: 3091, textUrl: 'https://www.gutenberg.org/cache/epub/3091/pg3091.txt' },
  { id: 'count-of-monte-cristo', title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', genre: 'Adventure', gutenbergId: 1184, textUrl: 'https://www.gutenberg.org/cache/epub/1184/pg1184.txt' },
  { id: 'three-musketeers', title: 'The Three Musketeers', author: 'Alexandre Dumas', genre: 'Adventure', gutenbergId: 1257, textUrl: 'https://www.gutenberg.org/cache/epub/1257/pg1257.txt' },
  { id: 'robinson-crusoe', title: 'Robinson Crusoe', author: 'Daniel Defoe', genre: 'Adventure', gutenbergId: 521, textUrl: 'https://www.gutenberg.org/cache/epub/521/pg521.txt' },
  { id: 'gullivers-travels', title: 'Gulliver\'s Travels', author: 'Jonathan Swift', genre: 'Adventure', gutenbergId: 829, textUrl: 'https://www.gutenberg.org/cache/epub/829/pg829.txt' },
  { id: 'the-odyssey', title: 'The Odyssey', author: 'Homer', genre: 'Adventure', gutenbergId: 1727, textUrl: 'https://www.gutenberg.org/cache/epub/1727/pg1727.txt' },
  { id: 'the-iliad', title: 'The Iliad', author: 'Homer', genre: 'Adventure', gutenbergId: 6130, textUrl: 'https://www.gutenberg.org/cache/epub/6130/pg6130.txt' },
  { id: 'the-prisoner-of-zenda', title: 'The Prisoner of Zenda', author: 'Anthony Hope', genre: 'Adventure', gutenbergId: 95, textUrl: 'https://www.gutenberg.org/cache/epub/95/pg95.txt' },
  { id: 'the-scarlet-pimpernel', title: 'The Scarlet Pimpernel', author: 'Baroness Orczy', genre: 'Adventure', gutenbergId: 60, textUrl: 'https://www.gutenberg.org/cache/epub/60/pg60.txt' },
  { id: 'king-solomons-mines', title: 'King Solomon\'s Mines', author: 'H. Rider Haggard', genre: 'Adventure', gutenbergId: 2166, textUrl: 'https://www.gutenberg.org/cache/epub/2166/pg2166.txt' },
  { id: 'she', title: 'She', author: 'H. Rider Haggard', genre: 'Adventure', gutenbergId: 3155, textUrl: 'https://www.gutenberg.org/cache/epub/3155/pg3155.txt' },
  { id: 'captain-blood', title: 'Captain Blood', author: 'Rafael Sabatini', genre: 'Adventure', gutenbergId: 1965, textUrl: 'https://www.gutenberg.org/cache/epub/1965/pg1965.txt' },
  { id: 'the-sea-hawk', title: 'The Sea-Hawk', author: 'Rafael Sabatini', genre: 'Adventure', gutenbergId: 1964, textUrl: 'https://www.gutenberg.org/cache/epub/1964/pg1964.txt' },
  { id: 'tarzan-of-the-apes', title: 'Tarzan of the Apes', author: 'Edgar Rice Burroughs', genre: 'Adventure', gutenbergId: 78, textUrl: 'https://www.gutenberg.org/cache/epub/78/pg78.txt' },
  { id: 'the-return-of-tarzan', title: 'The Return of Tarzan', author: 'Edgar Rice Burroughs', genre: 'Adventure', gutenbergId: 81, textUrl: 'https://www.gutenberg.org/cache/epub/81/pg81.txt' },
  { id: 'the-merry-adventures-of-robin-hood', title: 'The Merry Adventures of Robin Hood', author: 'Howard Pyle', genre: 'Adventure', gutenbergId: 964, textUrl: 'https://www.gutenberg.org/cache/epub/964/pg964.txt' },
  { id: 'the-swiss-family-robinson', title: 'The Swiss Family Robinson', author: 'Johann David Wyss', genre: 'Adventure', gutenbergId: 1844, textUrl: 'https://www.gutenberg.org/cache/epub/1844/pg1844.txt' },

  // --- MYSTERY ---
  { id: 'sherlock-holmes', title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', genre: 'Mystery', gutenbergId: 1661, textUrl: 'https://www.gutenberg.org/cache/epub/1661/pg1661.txt' },
  { id: 'sherlock-hound-baskervilles', title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', genre: 'Mystery', gutenbergId: 2852, textUrl: 'https://www.gutenberg.org/cache/epub/2852/pg2852.txt' },
  { id: 'a-study-in-scarlet', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', genre: 'Mystery', gutenbergId: 244, textUrl: 'https://www.gutenberg.org/cache/epub/244/pg244.txt' },
  { id: 'the-sign-of-the-four', title: 'The Sign of the Four', author: 'Arthur Conan Doyle', genre: 'Mystery', gutenbergId: 2097, textUrl: 'https://www.gutenberg.org/cache/epub/2097/pg2097.txt' },
  { id: 'the-memoirs-of-sherlock-holmes', title: 'The Memoirs of Sherlock Holmes', author: 'Arthur Conan Doyle', genre: 'Mystery', gutenbergId: 834, textUrl: 'https://www.gutenberg.org/cache/epub/834/pg834.txt' },
  { id: 'the-return-of-sherlock-holmes', title: 'The Return of Sherlock Holmes', author: 'Arthur Conan Doyle', genre: 'Mystery', gutenbergId: 1141, textUrl: 'https://www.gutenberg.org/cache/epub/1141/pg1141.txt' },
  { id: 'the-mysterious-affair-at-styles', title: 'The Mysterious Affair at Styles', author: 'Agatha Christie', genre: 'Mystery', gutenbergId: 863, textUrl: 'https://www.gutenberg.org/cache/epub/863/pg863.txt' },
  { id: 'the-secret-adversary', title: 'The Secret Adversary', author: 'Agatha Christie', genre: 'Mystery', gutenbergId: 1155, textUrl: 'https://www.gutenberg.org/cache/epub/1155/pg1155.txt' },
  { id: 'the-murder-on-the-links', title: 'The Murder on the Links', author: 'Agatha Christie', genre: 'Mystery', gutenbergId: 58866, textUrl: 'https://www.gutenberg.org/cache/epub/58866/pg58866.txt' },
  { id: 'the-man-in-the-brown-suit', title: 'The Man in the Brown Suit', author: 'Agatha Christie', genre: 'Mystery', gutenbergId: 61168, textUrl: 'https://www.gutenberg.org/cache/epub/61168/pg61168.txt' },
  { id: 'the-phantom-of-the-opera', title: 'The Phantom of the Opera', author: 'Gaston Leroux', genre: 'Mystery', gutenbergId: 175, textUrl: 'https://www.gutenberg.org/cache/epub/175/pg175.txt' },
  { id: 'the-mystery-of-the-yellow-room', title: 'The Mystery of the Yellow Room', author: 'Gaston Leroux', genre: 'Mystery', gutenbergId: 10582, textUrl: 'https://www.gutenberg.org/cache/epub/10582/pg10582.txt' },
  { id: 'the-woman-in-white', title: 'The Woman in White', author: 'Wilkie Collins', genre: 'Mystery', gutenbergId: 583, textUrl: 'https://www.gutenberg.org/cache/epub/583/pg583.txt' },
  { id: 'the-moonstone', title: 'The Moonstone', author: 'Wilkie Collins', genre: 'Mystery', gutenbergId: 155, textUrl: 'https://www.gutenberg.org/cache/epub/155/pg155.txt' },
  { id: 'the-riddle-of-the-sands', title: 'The Riddle of the Sands', author: 'Erskine Childers', genre: 'Mystery', gutenbergId: 2360, textUrl: 'https://www.gutenberg.org/cache/epub/2360/pg2360.txt' },

  // --- SCI-FI & FANTASY ---
  { id: 'war-of-worlds', title: 'The War of the Worlds', author: 'H.G. Wells', genre: 'Sci-Fi & Fantasy', gutenbergId: 36, textUrl: 'https://www.gutenberg.org/cache/epub/36/pg36.txt' },
  { id: 'time-machine', title: 'The Time Machine', author: 'H.G. Wells', genre: 'Sci-Fi & Fantasy', gutenbergId: 35, textUrl: 'https://www.gutenberg.org/cache/epub/35/pg35.txt' },
  { id: 'invisible-man', title: 'The Invisible Man', author: 'H.G. Wells', genre: 'Sci-Fi & Fantasy', gutenbergId: 5230, textUrl: 'https://www.gutenberg.org/cache/epub/5230/pg5230.txt' },
  { id: 'the-island-of-doctor-moreau', title: 'The Island of Doctor Moreau', author: 'H.G. Wells', genre: 'Sci-Fi & Fantasy', gutenbergId: 159, textUrl: 'https://www.gutenberg.org/cache/epub/159/pg159.txt' },
  { id: 'the-first-men-in-the-moon', title: 'The First Men in the Moon', author: 'H.G. Wells', genre: 'Sci-Fi & Fantasy', gutenbergId: 1013, textUrl: 'https://www.gutenberg.org/cache/epub/1013/pg1013.txt' },
  { id: 'twenty-thousand-leagues', title: 'Twenty Thousand Leagues Under the Sea', author: 'Jules Verne', genre: 'Sci-Fi & Fantasy', gutenbergId: 164, textUrl: 'https://www.gutenberg.org/cache/epub/164/pg164.txt' },
  { id: 'alice-in-wonderland', title: 'Alice\'s Adventures in Wonderland', author: 'Lewis Carroll', genre: 'Sci-Fi & Fantasy', gutenbergId: 11, textUrl: 'https://www.gutenberg.org/cache/epub/11/pg11.txt' },
  { id: 'through-the-looking-glass', title: 'Through the Looking-Glass', author: 'Lewis Carroll', genre: 'Sci-Fi & Fantasy', gutenbergId: 12, textUrl: 'https://www.gutenberg.org/cache/epub/12/pg12.txt' },
  { id: 'peter-pan', title: 'Peter Pan', author: 'J.M. Barrie', genre: 'Sci-Fi & Fantasy', gutenbergId: 16, textUrl: 'https://www.gutenberg.org/cache/epub/16/pg16.txt' },
  { id: 'the-wind-in-the-willows', title: 'The Wind in the Willows', author: 'Kenneth Grahame', genre: 'Sci-Fi & Fantasy', gutenbergId: 289, textUrl: 'https://www.gutenberg.org/cache/epub/289/pg289.txt' },
  { id: 'the-wonderful-wizard-of-oz', title: 'The Wonderful Wizard of Oz', author: 'L. Frank Baum', genre: 'Sci-Fi & Fantasy', gutenbergId: 43936, textUrl: 'https://www.gutenberg.org/cache/epub/43936/pg43936.txt' },
  { id: 'the-marvelous-land-of-oz', title: 'The Marvelous Land of Oz', author: 'L. Frank Baum', genre: 'Sci-Fi & Fantasy', gutenbergId: 54, textUrl: 'https://www.gutenberg.org/cache/epub/54/pg54.txt' },
  { id: 'ozma of oz', title: 'Ozma of Oz', author: 'L. Frank Baum', genre: 'Sci-Fi & Fantasy', gutenbergId: 33361, textUrl: 'https://www.gutenberg.org/cache/epub/33361/pg33361.txt' },
  { id: 'a-princess-of-mars', title: 'A Princess of Mars', author: 'Edgar Rice Burroughs', genre: 'Sci-Fi & Fantasy', gutenbergId: 62, textUrl: 'https://www.gutenberg.org/cache/epub/62/pg62.txt' },
  { id: 'the-gods-of-mars', title: 'The Gods of Mars', author: 'Edgar Rice Burroughs', genre: 'Sci-Fi & Fantasy', gutenbergId: 64, textUrl: 'https://www.gutenberg.org/cache/epub/64/pg64.txt' },
  { id: 'the-warlord-of-mars', title: 'The Warlord of Mars', author: 'Edgar Rice Burroughs', genre: 'Sci-Fi & Fantasy', gutenbergId: 68, textUrl: 'https://www.gutenberg.org/cache/epub/68/pg68.txt' },
  { id: 'flatland', title: 'Flatland', author: 'Edwin A. Abbott', genre: 'Sci-Fi & Fantasy', gutenbergId: 201, textUrl: 'https://www.gutenberg.org/cache/epub/201/pg201.txt' },
  { id: 'phantastes', title: 'Phantastes', author: 'George MacDonald', genre: 'Sci-Fi & Fantasy', gutenbergId: 325, textUrl: 'https://www.gutenberg.org/cache/epub/325/pg325.txt' },
  { id: 'the-princess-and-the-goblin', title: 'The Princess and the Goblin', author: 'George MacDonald', genre: 'Sci-Fi & Fantasy', gutenbergId: 726, textUrl: 'https://www.gutenberg.org/cache/epub/726/pg726.txt' },

  // --- SELF-HELP & BUSINESS ---
  { id: 'psychology-of-management', title: 'The Psychology of Management', author: 'L.M. Gilbreth', genre: 'Self-Help & Business', gutenbergId: 16256, textUrl: 'https://www.gutenberg.org/cache/epub/16256/pg16256.txt' },
  { id: 'think-and-grow-rich', title: 'Think and Grow Rich', author: 'Napoleon Hill', genre: 'Self-Help & Business', gutenbergId: 67138, textUrl: 'https://www.gutenberg.org/cache/epub/67138/pg67138.txt' },
  { id: 'personal-efficiency', title: 'Increasing Personal Efficiency', author: 'Russell H. Conwell', genre: 'Self-Help & Business', gutenbergId: 36622, textUrl: 'https://www.gutenberg.org/cache/epub/36622/pg36622.txt' },
  { id: 'art-of-money-getting', title: 'The Art of Money Getting', author: 'P.T. Barnum', genre: 'Self-Help & Business', gutenbergId: 8581, textUrl: 'https://www.gutenberg.org/cache/epub/8581/pg8581.txt' },
  { id: 'live-on-24-hours-a-day', title: 'How to Live on 24 Hours a Day', author: 'Arnold Bennett', genre: 'Self-Help & Business', gutenbergId: 2274, textUrl: 'https://www.gutenberg.org/cache/epub/2274/pg2274.txt' },
  { id: 'self-development', title: 'Self-Development and the Way to Power', author: 'L.W. Rogers', genre: 'Self-Help & Business', gutenbergId: 36940, textUrl: 'https://www.gutenberg.org/cache/epub/36940/pg36940.txt' },
  { id: 'the-art-of-war', title: 'The Art of War', author: 'Sun Tzu', genre: 'Self-Help & Business', gutenbergId: 132, textUrl: 'https://www.gutenberg.org/cache/epub/132/pg132.txt' },
  { id: 'the-prince', title: 'The Prince', author: 'Niccolò Machiavelli', genre: 'Self-Help & Business', gutenbergId: 1232, textUrl: 'https://www.gutenberg.org/cache/epub/1232/pg1232.txt' },
  { id: 'as-a-man-thinketh', title: 'As a Man Thinketh', author: 'James Allen', genre: 'Self-Help & Business', gutenbergId: 4507, textUrl: 'https://www.gutenberg.org/cache/epub/4507/pg4507.txt' },
  { id: 'the-path-of-prosperity', title: 'The Path of Prosperity', author: 'James Allen', genre: 'Self-Help & Business', gutenbergId: 5459, textUrl: 'https://www.gutenberg.org/cache/epub/5459/pg5459.txt' },
  { id: 'out-from-the-heart', title: 'Out from the Heart', author: 'James Allen', genre: 'Self-Help & Business', gutenbergId: 7705, textUrl: 'https://www.gutenberg.org/cache/epub/7705/pg7705.txt' },
  { id: 'self-reliance', title: 'Self-Reliance', author: 'Ralph Waldo Emerson', genre: 'Self-Help & Business', gutenbergId: 38781, textUrl: 'https://www.gutenberg.org/cache/epub/38781/pg38781.txt' },
  { id: 'essays-by-emerson', title: 'Essays', author: 'Ralph Waldo Emerson', genre: 'Self-Help & Business', gutenbergId: 2944, textUrl: 'https://www.gutenberg.org/cache/epub/2944/pg2944.txt' },
  { id: 'character', title: 'Character', author: 'Samuel Smiles', genre: 'Self-Help & Business', gutenbergId: 13735, textUrl: 'https://www.gutenberg.org/cache/epub/13735/pg13735.txt' },
  { id: 'thrift', title: 'Thrift', author: 'Samuel Smiles', genre: 'Self-Help & Business', gutenbergId: 14418, textUrl: 'https://www.gutenberg.org/cache/epub/14418/pg14418.txt' },
  { id: 'duty', title: 'Duty', author: 'Samuel Smiles', genre: 'Self-Help & Business', gutenbergId: 15206, textUrl: 'https://www.gutenberg.org/cache/epub/15206/pg15206.txt' },

  // --- PSYCHOLOGY & PHILOSOPHY ---
  { id: 'dream-psychology', title: 'Dream Psychology: Psychoanalysis for Beginners', author: 'Sigmund Freud', genre: 'Psychology & Philosophy', gutenbergId: 15489, textUrl: 'https://www.gutenberg.org/cache/epub/15489/pg15489.txt' },
  { id: 'the-interpretation-of-dreams', title: 'The Interpretation of Dreams', author: 'Sigmund Freud', genre: 'Psychology & Philosophy', gutenbergId: 66084, textUrl: 'https://www.gutenberg.org/cache/epub/66084/pg66084.txt' },
  { id: 'psychopathology-of-everyday-life', title: 'Psychopathology of Everyday Life', author: 'Sigmund Freud', genre: 'Psychology & Philosophy', gutenbergId: 63391, textUrl: 'https://www.gutenberg.org/cache/epub/63391/pg63391.txt' },
  { id: 'introductory-lectures-on-psychoanalysis', title: 'Introductory Lectures on Psycho-Analysis', author: 'Sigmund Freud', genre: 'Psychology & Philosophy', gutenbergId: 67123, textUrl: 'https://www.gutenberg.org/cache/epub/67123/pg67123.txt' },
  { id: 'group-psychology-and-analysis-of-the-ego', title: 'Group Psychology and the Analysis of the Ego', author: 'Sigmund Freud', genre: 'Psychology & Philosophy', gutenbergId: 35877, textUrl: 'https://www.gutenberg.org/cache/epub/35877/pg35877.txt' },
  { id: 'meditations', title: 'Meditations', author: 'Marcus Aurelius', genre: 'Psychology & Philosophy', gutenbergId: 64481, textUrl: 'https://www.gutenberg.org/cache/epub/64481/pg64481.txt' },
  { id: 'walden', title: 'Walden', author: 'Henry David Thoreau', genre: 'Psychology & Philosophy', gutenbergId: 205, textUrl: 'https://www.gutenberg.org/cache/epub/205/pg205.txt' },
  { id: 'on-liberty', title: 'On Liberty', author: 'John Stuart Mill', genre: 'Psychology & Philosophy', gutenbergId: 34901, textUrl: 'https://www.gutenberg.org/cache/epub/34901/pg34901.txt' },
  { id: 'the-prophet', title: 'The Prophet', author: 'Kahlil Gibran', genre: 'Psychology & Philosophy', gutenbergId: 58585, textUrl: 'https://www.gutenberg.org/cache/epub/58585/pg58585.txt' },
  { id: 'the-book-of-tea', title: 'The Book of Tea', author: 'Okakura Kakuzo', genre: 'Psychology & Philosophy', gutenbergId: 769, textUrl: 'https://www.gutenberg.org/cache/epub/769/pg769.txt' },
  { id: 'the-varieties-of-religious-experience', title: 'The Varieties of Religious Experience', author: 'William James', genre: 'Psychology & Philosophy', gutenbergId: 621, textUrl: 'https://www.gutenberg.org/cache/epub/621/pg621.txt' },
  { id: 'pragmatism', title: 'Pragmatism', author: 'William James', genre: 'Psychology & Philosophy', gutenbergId: 5116, textUrl: 'https://www.gutenberg.org/cache/epub/5116/pg5116.txt' },
  { id: 'beyond-good-and-evil', title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche', genre: 'Psychology & Philosophy', gutenbergId: 4363, textUrl: 'https://www.gutenberg.org/cache/epub/4363/pg4363.txt' },
  { id: 'thus-spake-zarathustra', title: 'Thus Spake Zarathustra', author: 'Friedrich Nietzsche', genre: 'Psychology & Philosophy', gutenbergId: 1998, textUrl: 'https://www.gutenberg.org/cache/epub/1998/pg1998.txt' },
  { id: 'the-antichrist', title: 'The Antichrist', author: 'Friedrich Nietzsche', genre: 'Psychology & Philosophy', gutenbergId: 19322, textUrl: 'https://www.gutenberg.org/cache/epub/19322/pg19322.txt' },
  { id: 'the-republic', title: 'The Republic', author: 'Plato', genre: 'Psychology & Philosophy', gutenbergId: 1497, textUrl: 'https://www.gutenberg.org/cache/epub/1497/pg1497.txt' },
  { id: 'the-symposium', title: 'The Symposium', author: 'Plato', genre: 'Psychology & Philosophy', gutenbergId: 1600, textUrl: 'https://www.gutenberg.org/cache/epub/1600/pg1600.txt' },

  // --- CLASSIC LITERATURE ---
  { id: 'frankenstein', title: 'Frankenstein', author: 'Mary Shelley', genre: 'Classic Literature', gutenbergId: 84, textUrl: 'https://www.gutenberg.org/cache/epub/84/pg84.txt' },
  { id: 'dracula', title: 'Dracula', author: 'Bram Stoker', genre: 'Classic Literature', gutenbergId: 345, textUrl: 'https://www.gutenberg.org/cache/epub/345/pg345.txt' },
  { id: 'great-gatsby', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Literature', gutenbergId: 64317, textUrl: 'https://www.gutenberg.org/cache/epub/64317/pg64317.txt' },
  { id: 'this-side-of-paradise', title: 'This Side of Paradise', author: 'F. Scott Fitzgerald', genre: 'Classic Literature', gutenbergId: 805, textUrl: 'https://www.gutenberg.org/cache/epub/805/pg805.txt' },
  { id: 'the-metamorphosis', title: 'The Metamorphosis', author: 'Franz Kafka', genre: 'Classic Literature', gutenbergId: 5200, textUrl: 'https://www.gutenberg.org/cache/epub/5200/pg5200.txt' },
  { id: 'tale-of-two-cities', title: 'A Tale of Two Cities', author: 'Charles Dickens', genre: 'Classic Literature', gutenbergId: 98, textUrl: 'https://www.gutenberg.org/cache/epub/98/pg98.txt' },
  { id: 'oliver-twist', title: 'Oliver Twist', author: 'Charles Dickens', genre: 'Classic Literature', gutenbergId: 730, textUrl: 'https://www.gutenberg.org/cache/epub/730/pg730.txt' },
  { id: 'a-christmas-carol', title: 'A Christmas Carol', author: 'Charles Dickens', genre: 'Classic Literature', gutenbergId: 46, textUrl: 'https://www.gutenberg.org/cache/epub/46/pg46.txt' },
  { id: 'great-expectations', title: 'Great Expectations', author: 'Charles Dickens', genre: 'Classic Literature', gutenbergId: 1400, textUrl: 'https://www.gutenberg.org/cache/epub/1400/pg1400.txt' },
  { id: 'david-copperfield', title: 'David Copperfield', author: 'Charles Dickens', genre: 'Classic Literature', gutenbergId: 766, textUrl: 'https://www.gutenberg.org/cache/epub/766/pg766.txt' },
  { id: 'bleak-house', title: 'Bleak House', author: 'Charles Dickens', genre: 'Classic Literature', gutenbergId: 1023, textUrl: 'https://www.gutenberg.org/cache/epub/1023/pg1023.txt' },
  { id: 'hard-times', title: 'Hard Times', author: 'Charles Dickens', genre: 'Classic Literature', gutenbergId: 194, textUrl: 'https://www.gutenberg.org/cache/epub/194/pg194.txt' },
  { id: 'hamlet', title: 'Hamlet', author: 'William Shakespeare', genre: 'Classic Literature', gutenbergId: 1524, textUrl: 'https://www.gutenberg.org/cache/epub/1524/pg1524.txt' },
  { id: 'the-picture-of-dorian-gray', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', genre: 'Classic Literature', gutenbergId: 174, textUrl: 'https://www.gutenberg.org/cache/epub/174/pg174.txt' },
  { id: 'the-importance-of-being-earnest', title: 'The Importance of Being Earnest', author: 'Oscar Wilde', genre: 'Classic Literature', gutenbergId: 844, textUrl: 'https://www.gutenberg.org/cache/epub/844/pg844.txt' },
  { id: 'crime-and-punishment', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Classic Literature', gutenbergId: 2554, textUrl: 'https://www.gutenberg.org/cache/epub/2554/pg2554.txt' },
  { id: 'brothers-karamazov', title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', genre: 'Classic Literature', gutenbergId: 28054, textUrl: 'https://www.gutenberg.org/cache/epub/28054/pg28054.txt' },
  { id: 'the-idiot', title: 'The Idiot', author: 'Fyodor Dostoevsky', genre: 'Classic Literature', gutenbergId: 2638, textUrl: 'https://www.gutenberg.org/cache/epub/2638/pg2638.txt' },
  { id: 'the-gambler', title: 'The Gambler', author: 'Fyodor Dostoevsky', genre: 'Classic Literature', gutenbergId: 2197, textUrl: 'https://www.gutenberg.org/cache/epub/2197/pg2197.txt' },
  { id: 'don-quixote', title: 'Don Quixote', author: 'Miguel de Cervantes', genre: 'Classic Literature', gutenbergId: 996, textUrl: 'https://www.gutenberg.org/cache/epub/996/pg996.txt' },
  { id: 'the-strange-case-of-dr-jekyll-and-mr-hyde', title: 'The Strange Case of Dr. Jekyll and Mr. Hyde', author: 'Robert Louis Stevenson', genre: 'Classic Literature', gutenbergId: 43, textUrl: 'https://www.gutenberg.org/cache/epub/43/pg43.txt' },
  { id: 'les-miserables', title: 'Les Misérables', author: 'Victor Hugo', genre: 'Classic Literature', gutenbergId: 135, textUrl: 'https://www.gutenberg.org/cache/epub/135/pg135.txt' },
  { id: 'the-hunchback-of-notre-dame', title: 'The Hunchback of Notre Dame', author: 'Victor Hugo', genre: 'Classic Literature', gutenbergId: 2610, textUrl: 'https://www.gutenberg.org/cache/epub/2610/pg2610.txt' },
  { id: 'the-red-badge-of-courage', title: 'The Red Badge of Courage', author: 'Stephen Crane', genre: 'Classic Literature', gutenbergId: 73, textUrl: 'https://www.gutenberg.org/cache/epub/73/pg73.txt' },
  { id: 'house-of-the-seven-gables', title: 'The House of the Seven Gables', author: 'Nathaniel Hawthorne', genre: 'Classic Literature', gutenbergId: 1826, textUrl: 'https://www.gutenberg.org/cache/epub/1826/pg1826.txt' },
  { id: 'the-scarlet-letter', title: 'The Scarlet Letter', author: 'Nathaniel Hawthorne', genre: 'Classic Literature', gutenbergId: 33, textUrl: 'https://www.gutenberg.org/cache/epub/33/pg33.txt' },
  { id: 'pygmalion', title: 'Pygmalion', author: 'George Bernard Shaw', genre: 'Classic Literature', gutenbergId: 3825, textUrl: 'https://www.gutenberg.org/cache/epub/3825/pg3825.txt' },
  { id: 'faust', title: 'Faust', author: 'Johann Wolfgang von Goethe', genre: 'Classic Literature', gutenbergId: 14591, textUrl: 'https://www.gutenberg.org/cache/epub/14591/pg14591.txt' },
  { id: 'the-divine-comedy', title: 'The Divine Comedy', author: 'Dante Alighieri', genre: 'Classic Literature', gutenbergId: 8800, textUrl: 'https://www.gutenberg.org/cache/epub/8800/pg8800.txt' },
  { id: 'uncle-toms-cabin', title: 'Uncle Tom\'s Cabin', author: 'Harriet Beecher Stowe', genre: 'Classic Literature', gutenbergId: 203, textUrl: 'https://www.gutenberg.org/cache/epub/203/pg203.txt' },
  { id: 'the-awakening', title: 'The Awakening', author: 'Kate Chopin', genre: 'Classic Literature', gutenbergId: 160, textUrl: 'https://www.gutenberg.org/cache/epub/160/pg160.txt' },
  { id: 'main-street', title: 'Main Street', author: 'Sinclair Lewis', genre: 'Classic Literature', gutenbergId: 2442, textUrl: 'https://www.gutenberg.org/cache/epub/2442/pg2442.txt' },
  { id: 'babbitt', title: 'Babbitt', author: 'Sinclair Lewis', genre: 'Classic Literature', gutenbergId: 1158, textUrl: 'https://www.gutenberg.org/cache/epub/1158/pg1158.txt' },
  { id: 'the-jungle', title: 'The Jungle', author: 'Upton Sinclair', genre: 'Classic Literature', gutenbergId: 140, textUrl: 'https://www.gutenberg.org/cache/epub/140/pg140.txt' }
];

/**
 * Fetch and parse the raw full text of a book.
 * Books are stored locally in /books/{id}.txt (no CORS, works offline).
 * Falls back to external CORS proxies if the local file is missing.
 */
export async function fetchBookText(textUrl, bookId) {
  let raw = null;

  // 1. Try local bundled file first (fast, offline-capable, no CORS)
  if (bookId) {
    try {
      const localUrl = `/books/${bookId}.txt`;
      const res = await fetch(localUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const text = await res.text();
        if (text.length > 1000) raw = text;
      }
    } catch (_) { /* fall through */ }
  }

  // 2. If local failed, try external CORS proxies
  if (!raw) {
    const proxyBuilders = [
      (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
      (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
      (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    ];
    let lastError = null;
    for (const buildProxy of proxyBuilders) {
      try {
        const res = await fetch(buildProxy(textUrl), { signal: AbortSignal.timeout(12000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (text.length > 1000) { raw = text; break; }
      } catch (e) { lastError = e; }
    }
    if (!raw) throw new Error(lastError?.message || 'Could not load book.');
  }

  // Strip Gutenberg header/footer
  const startMarker = raw.indexOf('*** START OF THE PROJECT GUTENBERG EBOOK');
  const endMarker   = raw.indexOf('*** END OF THE PROJECT GUTENBERG EBOOK');
  let body = raw;
  if (startMarker !== -1) {
    const startIdx = raw.indexOf('\n', startMarker) + 1;
    body = endMarker !== -1 ? raw.slice(startIdx, endMarker) : raw.slice(startIdx);
  }

  // Split into paragraphs
  body = body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const paragraphs = body
    .split(/\n{2,}/)
    .map(p => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(p => p.length > 20);

  return paragraphs;
}
