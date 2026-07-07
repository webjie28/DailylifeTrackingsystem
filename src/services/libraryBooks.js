export const LIBRARY_BOOKS = [
  {
    id: 'book_1',
    title: 'Atomic Habits',
    author: 'James Clear',
    emoji: '🌱',
    genre: 'Self-Improvement',
    description: 'Build good habits and break bad ones using the four laws of behavior change.',
    chapters: [
      {
        title: 'Chapter 1: The Surprising Power of Tiny Habits',
        content: `Success is the product of daily habits—not once-in-a-lifetime transformations. If you get 1 percent better each day for one year, you’ll end up thirty-seven times better by the time you’re done. Conversely, if you get 1 percent worse each day for one year, you’ll decline nearly down to zero. What starts as a small win or a minor setback accumulates into something much more.\n\nHabits are the compound interest of self-improvement. The same way money multiplies through compound interest, the effects of your habits multiply as you repeat them. They seem to make little difference on any given day, yet the impact they deliver over the months and years can be enormous. It is only when looking back two, five, or perhaps ten years later that the value of good habits and the cost of bad ones becomes strikingly apparent.`
      },
      {
        title: 'Chapter 2: How Your Habits Shape Your Identity',
        content: `Most people start the process of changing their habits by focusing on what they want to achieve. This leads to outcome-based habits. The alternative is to build identity-based habits. With this approach, we start by focusing on who we wish to become.\n\nImagine two people resisting a cigarette. When offered a smoke, the first person says, "No thanks, I’m trying to quit." It sounds like a reasonable response, but this person still believes they are a smoker who is trying to be something else. The second person declines by saying, "No thanks, I’m not a smoker." It’s a small difference, but this statement signals a shift in identity. Smoking was part of their past life, not their current one. They no longer identify as a smoker.`
      },
      {
        title: 'Chapter 3: The 4 Laws of Behavior Change',
        content: `The process of building a habit can be divided into four simple steps: cue, craving, response, and reward. Breaking it down into these fundamental parts can help us understand what a habit is, how it works, and how to improve it.\n\nThese four stages form a feedback loop: cue triggers craving, which motivates response, which provides a reward, which satisfies the craving and becomes associated with the cue. Together, these four steps create a loop that helps you form automatic habits.\n\nTo make a habit stick, apply the Four Laws of Behavior Change:\n1. Make it obvious (Cue)\n2. Make it attractive (Craving)\n3. Make it easy (Response)\n4. Make it satisfying (Reward)`
      }
    ]
  },
  {
    id: 'book_2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    emoji: '💻',
    genre: 'Software Engineering',
    description: 'A handbook of agile software craftsmanship for writing cleaner, more maintainable code.',
    chapters: [
      {
        title: 'Chapter 1: Clean Code Principles',
        content: `Clean code is code that has been formatted and written in a way that is easy to read and understand. It should be simple, direct, and convey the design intent clearly. Writing clean code is not about following a set of strict rules, but rather about developing a sense of craftsmanship and caring for the work.\n\nBjarne Stroustrup, inventor of C++, says: "I like my code to be elegant and efficient. The logic should be relatively straightforward to make it hard for bugs to hide, the dependencies minimal to ease maintenance, and error handling complete according to an articulated strategy."`
      },
      {
        title: 'Chapter 2: Meaningful Names',
        content: `Names are everywhere in software. We name variables, functions, arguments, classes, packages, and files. Choosing good names takes time but saves more than it takes. The name of a variable, function, or class should answer all the big questions. It should tell you why it exists, what it does, and how it is used. If a name requires a comment, then the name does not reveal its intent.\n\nAvoid using names that are ambiguous, misleading, or excessively short (like a single letter, except for loop counters). Use pronounceable, searchable, and descriptive names that fit the domain.`
      },
      {
        title: 'Chapter 3: Functions should do one thing',
        content: `The first rule of functions is that they should be small. The second rule of functions is that they should be smaller than that. Functions should rarely be over 20 lines long, and they should do exactly one thing, do it well, and do it only.\n\nWhen a function does only one thing, it is easy to read, test, and reason about. If a function contains sections that can be extracted into smaller functions with distinct names, then it is doing more than one thing.`
      }
    ]
  },
  {
    id: 'book_3',
    title: 'Deep Work',
    author: 'Cal Newport',
    emoji: '🧠',
    genre: 'Productivity',
    description: 'Rules for focused success in a distracted world.',
    chapters: [
      {
        title: 'Chapter 1: The Deep Work Hypothesis',
        content: `Deep work is the ability to focus without distraction on a cognitively demanding task. It’s a skill that allows you to quickly master complicated information and produce better results in less time. Deep work will make you better at what you do and provide the sense of true fulfillment that comes from craftsmanship.\n\nIn our modern economy, the capacity to perform deep work is becoming increasingly rare. At the exact same time, it is becoming increasingly valuable. As a result, the few who cultivate this skill, and then make it the core of their working life, will thrive.`
      },
      {
        title: 'Chapter 2: The Enemies of Depth',
        content: `Network tools (social media, email, messaging apps) are designed to hijack your attention. They fragment your focus and encourage shallow work—non-cognitively demanding, logistical-style tasks that are easily replicated and performable while distracted.\n\nTo combat this attention fragmentation, you must train your brain to resist distraction. Constant multitasking trains your neural pathways to expect novel stimuli, making it harder to sustain deep, focused attention when you need to.`
      },
      {
        title: 'Chapter 3: Rules of Deep Work',
        content: `Rule 1: Work Deeply. Integrate rituals and routines into your working life to minimize the amount of willpower required to transition into and maintain a state of unbroken focus.\n\nRule 2: Embrace Boredom. Instead of switching to your smartphone at the slightest hint of boredom, practice sitting with your thoughts. This trains your concentration muscles.\n\nRule 3: Quit Social Media. Evaluate your online tools based on whether they substantially contribute to your primary professional and personal goals.\n\nRule 4: Drain the Shallows. Schedule every minute of your day to gain control of your time and limit shallow work.`
      }
    ]
  },
  {
    id: 'book_4',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    emoji: '💰',
    genre: 'Finance & Wealth',
    description: 'Timeless lessons on wealth, greed, and happiness.',
    chapters: [
      {
        title: 'Chapter 1: No One’s Crazy',
        content: `Your personal experiences with money make up maybe 0.00000001% of what’s happened in the world, but rules about 80% of how you think the world works. People from different generations, raised by different parents who earned different incomes and held different values, learn completely different lessons.\n\nWe all do things with money that make sense to us in the moment, based on our unique backgrounds, values, and the environment we live in.`
      },
      {
        title: 'Chapter 2: Confounding Compounding',
        content: `Warren Buffett is one of the wealthiest investors in history. But his secret isn't just that he is a good investor; his secret is time. He started investing when he was ten years old. Compounding works like a snowball: small, consistent gains repeated over decades create mind-boggling outcomes.\n\nThe most powerful lessons in finance come from understanding that compounding is like magic. It is non-linear, counter-intuitive, and requires immense patience.`
      },
      {
        title: 'Chapter 3: Getting Wealthy vs. Staying Wealthy',
        content: `Getting money requires taking risks, being optimistic, and putting yourself out there. Staying money requires the opposite: humility, frugality, and a healthy dose of paranoia. It requires accepting that some of what you made was due to luck, so you can't rely on past success to repeat itself.\n\nStaying wealthy is about survival—making sure you never have to sell your assets prematurely and letting compounding work its magic undisturbed.`
      }
    ]
  },
  {
    id: 'book_5',
    title: 'Start with Why',
    author: 'Simon Sinek',
    emoji: '🎯',
    genre: 'Leadership',
    description: 'How great leaders inspire everyone to take action.',
    chapters: [
      {
        title: 'Chapter 1: Assume You Know',
        content: `We make decisions based on what we think we know. When we look at successful companies, we often look at *what* they do or *how* they do it. But inspiration and long-term loyalty come from something deeper: *why* they do it.\n\nMost organizations can explain what they do and how they are different. Very few can clearly articulate why they exist. "Why" is not about making money; that is a result. "Why" is your purpose, cause, or belief.`
      },
      {
        title: 'Chapter 2: The Golden Circle',
        content: `The Golden Circle consists of three concentric rings: WHY, HOW, and WHAT.\n\n- **WHAT**: Every single company knows what they do (products or services).\n- **HOW**: Some companies know how they do it (unique values, proprietary processes).\n- **WHY**: Very few companies can articulate why they do it. Why does your company exist? Why should anyone care?\n\nWhen organizations start from the outside-in (What -> How -> Why), they manipulate. When they communicate from the inside-out (Why -> How -> What), they inspire.`
      }
    ]
  },
  {
    id: 'book_6',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    emoji: '🚀',
    genre: 'Business & Startup',
    description: 'How constant innovation creates radically successful businesses.',
    chapters: [
      {
        title: 'Chapter 1: Start',
        content: `A startup is a human institution designed to create a new product or service under conditions of extreme uncertainty. Traditional management plans are based on a stable operating history, which startups lack. Startups need validated learning to discover how to build a sustainable business.\n\nInstead of planning for months, startups should build a Minimum Viable Product (MVP) to begin testing assumptions immediately.`
      },
      {
        title: 'Chapter 2: Define and Learn',
        content: `Validated learning is a rigorous method for demonstrating progress when one is embedded in a startup environment. It is the process of testing assumptions empirically to find what creates value for customers.\n\nEvery product feature, campaign, or change is an experiment designed to learn if it contributes to the business model.`
      },
      {
        title: 'Chapter 3: Build-Measure-Learn',
        content: `The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere. All startup processes should be geared to accelerate this feedback loop.\n\nBy building an MVP quickly, measuring its performance, and learning from data, entrepreneurs can avoid wasting resources on products nobody wants.`
      }
    ]
  },
  {
    id: 'book_7',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    emoji: '🧠',
    genre: 'Psychology',
    description: 'The two systems that drive the way we think and make decisions.',
    chapters: [
      {
        title: 'Chapter 1: Two Systems',
        content: `Our brain uses two distinct systems to process information and make decisions:\n\n- **System 1 (Fast)**: Operates automatically, quickly, with little or no effort, and no sense of voluntary control. It handles activities like detecting that one object is more distant than another, or answering 2+2.\n- **System 2 (Slow)**: Allocates attention to the effortful mental activities that demand it, including complex calculations. It is associated with agency, choice, and concentration.`
      },
      {
        title: 'Chapter 2: Attention and Effort',
        content: `System 2 is lazy. It runs in a low-effort state and only activates when System 1 runs into difficulty. System 2 takes effort, which drains glucose and increases heart rate.\n\nBecause System 2 requires attention, multitasking is difficult. If you focus deeply on a complex problem, you become temporarily blind to other stimuli around you.`
      }
    ]
  },
  {
    id: 'book_8',
    title: 'Zero to One',
    author: 'Peter Thiel',
    emoji: '💡',
    genre: 'Business & Startup',
    description: 'Notes on startups, or how to build the future.',
    chapters: [
      {
        title: 'Chapter 1: The Challenge of the Future',
        content: `Doing what we already know how to do takes the world from 1 to n, adding more of something familiar. But every time we create something new, we go from 0 to 1. The act of creation is singular, as is the moment of creation, and the result is something fresh and strange.\n\nIf you take 1 typewriter and build 100 typewriters, you have made horizontal progress (1 to n). If you have 1 typewriter and build a word processor, you have made vertical progress (0 to 1).`
      },
      {
        title: 'Chapter 2: Monopoly Capitalism',
        content: `Monopoly is the condition of every successful business. Under perfect competition, all profits are competed away. Monopolies can set their own prices, allowing them to invest in research and plan for the long-term future.\n\nTo build a valuable business, you must create a monopoly by offering a product that is at least 10 times better than its closest substitute.`
      }
    ]
  },
  {
    id: 'book_9',
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    emoji: '🖕',
    genre: 'Self-Improvement',
    description: 'A counterintuitive approach to living a good life.',
    chapters: [
      {
        title: 'Chapter 1: Don’t Try',
        content: `The feedback loop from hell is when you get anxious about being anxious, or angry about being angry. The key to a good life is not giving a f*ck about more; it is giving a f*ck about less—only what is true, immediate, and important.\n\nWe are bombarded with messages to care about everything. True happiness comes from choosing what is worth caring about and accepting that life contains struggle.`
      },
      {
        title: 'Chapter 2: Happiness is a Problem',
        content: `Happiness comes from solving problems. Problems never stop; they merely get exchanged or upgraded. True fulfillment comes from finding problems you enjoy solving.\n\nInstead of asking "What do I want to enjoy?", ask "What pain do I want to sustain?" The path to happiness is paved with the struggles we choose to endure.`
      }
    ]
  },
  {
    id: 'book_10',
    title: 'Grit',
    author: 'Angela Duckworth',
    emoji: '🏃',
    genre: 'Psychology',
    description: 'The power of passion and perseverance for long-term goals.',
    chapters: [
      {
        title: 'Chapter 1: Grit Matters More Than Talent',
        content: `We often overemphasize natural talent because it lets us off the hook—if someone is a genius, we don't have to compete with them. But effort counts twice:\n\n1. Talent × Effort = Skill\n2. Skill × Effort = Achievement\n\nTalent is how fast your skills improve when you put in effort. Achievement is what happens when you take those skills and apply them.`
      },
      {
        title: 'Chapter 2: Growing Grit from the Inside Out',
        content: `Grit has four assets: interest, practice, purpose, and hope. To grow grit, cultivate a deep interest in your work, commit to deliberate practice, connect your work to a larger purpose, and maintain hope that your efforts can change your future.`
      }
    ]
  },
  {
    id: 'book_11',
    title: 'Drive',
    author: 'Daniel Pink',
    emoji: '🚗',
    genre: 'Psychology',
    description: 'The surprising truth about what motivates us.',
    chapters: [
      {
        title: 'Chapter 1: Motivation 2.0 vs 3.0',
        content: `Traditional management relies on carrots and sticks (Motivation 2.0)—extrinsic rewards and punishments. This works for simple, algorithmic tasks. But for modern, creative tasks, it crushes performance.\n\nMotivation 3.0 is built on intrinsic motivation—the desire to do things because they are interesting, challenging, and personally rewarding.`
      },
      {
        title: 'Chapter 2: Autonomy, Mastery, Purpose',
        content: `Intrinsic motivation consists of three main elements:\n\n- **Autonomy**: The desire to direct our own lives (our time, task, technique, and team).\n- **Mastery**: The urge to get better and better at something that matters.\n- **Purpose**: The yearning to do what we do in the service of something larger than ourselves.`
      }
    ]
  },
  {
    id: 'book_12',
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    emoji: '🤝',
    genre: 'Self-Improvement',
    description: 'Fundamental techniques in handling people and winning cooperation.',
    chapters: [
      {
        title: 'Chapter 1: Fundamental Techniques in Handling People',
        content: `Principle 1: Don’t criticize, condemn or complain. Criticism is futile because it puts a person on the defensive and usually makes them strive to justify themselves. It wounds a person's pride and hurts their sense of importance.\n\nInstead of condemning people, let's try to understand them. Let's try to figure out why they do what they do. That is a lot more profitable and intriguing than criticism.`
      },
      {
        title: 'Chapter 2: Six Ways to Make People Like You',
        content: `Principle 1: Become genuinely interested in other people.\nPrinciple 2: Smile.\nPrinciple 3: Remember that a person’s name is to that person the sweetest and most important sound in any language.\nPrinciple 4: Be a good listener. Encourage others to talk about themselves.\nPrinciple 5: Talk in terms of the other person’s interests.\nPrinciple 6: Make the other person feel important—and do it sincerely.`
      }
    ]
  },
  {
    id: 'book_13',
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen Covey',
    emoji: '📅',
    genre: 'Self-Improvement',
    description: 'Powerful lessons in personal and professional change.',
    chapters: [
      {
        title: 'Chapter 1: Be Proactive',
        content: `Being proactive is more than taking initiative. It means that as human beings, we are responsible for our own lives. Our behavior is a function of our decisions, not our conditions. We have the initiative and the responsibility to make things happen.\n\nFocus your attention and energy on your Circle of Influence—things you can actually do something about—rather than your Circle of Concern.`
      },
      {
        title: 'Chapter 2: Begin with the End in Mind',
        content: `To begin with the end in mind means to start with a clear understanding of your destination. It means to know where you are going so that you better understand where you are now, so that the steps you take are always in the right direction.\n\nThe most effective way to begin with the end in mind is to write a personal mission statement.`
      }
    ]
  },
  {
    id: 'book_14',
    title: 'Good to Great',
    author: 'Jim Collins',
    emoji: '📈',
    genre: 'Leadership',
    description: 'Why some companies make the leap and others don’t.',
    chapters: [
      {
        title: 'Chapter 1: Level 5 Leadership',
        content: `Level 5 leaders channel their ego needs away from themselves and into the larger goal of building a great company. It is not that they have no ego or self-interest; they are incredibly ambitious, but their ambition is first and foremost for the institution, not themselves.\n\nThey display a powerful mixture of personal humility and professional will.`
      },
      {
        title: 'Chapter 2: First Who... Then What',
        content: `Great companies start by getting the right people on the bus, the wrong people off the bus, and the right people in the right seats—and then they figure out where to drive it. People are not your most important asset; the *right* people are.\n\nIf you have the right people, they will motivate themselves and help build something great.`
      }
    ]
  },
  {
    id: 'book_15',
    title: 'The Art of War',
    author: 'Sun Tzu',
    emoji: '⚔️',
    genre: 'Philosophy',
    description: 'Ancient military strategies and tactics applicable to modern life and competition.',
    chapters: [
      {
        title: 'Chapter 1: Laying Plans',
        content: `Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.\n\nAll warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near.`
      },
      {
        title: 'Chapter 2: Waging War',
        content: `In the operations of war, where there are in the field a thousand swift chariots, as many heavy chariots, and a hundred thousand mail-clad soldiers, with provisions enough to carry them a thousand li, the expenditure at home and at the front, including entertainment of guests, small items such as glue and paint, and sums spent on chariots and armor, will reach the total of a thousand ounces of silver per day. Only when such a sum is at hand can an army of a hundred thousand men be raised.`
      }
    ]
  },
  {
    id: 'book_16',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    emoji: '🏛️',
    genre: 'Philosophy',
    description: 'Stoic philosophy notes on self-discipline, death, and virtue.',
    chapters: [
      {
        title: 'Chapter 1: On Morning Thoughts',
        content: `When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine.`
      },
      {
        title: 'Chapter 2: On Controlling the Mind',
        content: `You have power over your mind - not outside events. Realize this, and you will find strength. Let go of the desire for external validation and focus entirely on your own actions, virtue, and character. Nothing happens to any man that he is not formed by nature to bear.`
      }
    ]
  },
  {
    id: 'book_17',
    title: 'Focus',
    author: 'Daniel Goleman',
    emoji: '🎯',
    genre: 'Productivity',
    description: 'The hidden driver of excellence and high performance.',
    chapters: [
      {
        title: 'Chapter 1: The Anatomy of Attention',
        content: `Attention works much like a muscle: use it poorly and it can wither; work it well and it grows. Focus is the hidden asset of high performance. It allows you to direct your mental capacity to what you want to achieve, without being distracted by notifications or wandering thoughts.`
      }
    ]
  },
  {
    id: 'book_18',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    emoji: '🥂',
    genre: 'Fiction & Literature',
    description: 'A study of the American Dream, romance, and tragedy.',
    chapters: [
      {
        title: 'Chapter 1: Introduction to Long Island',
        content: `In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since. "Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven’t had the advantages that you’ve had."`
      }
    ]
  },
  {
    id: 'book_19',
    title: '1984',
    author: 'George Orwell',
    emoji: '👁️',
    genre: 'Fiction & Literature',
    description: 'Dystopian study of totalitarianism and surveillance state.',
    chapters: [
      {
        title: 'Chapter 1: Big Brother is Watching You',
        content: `It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.`
      }
    ]
  },
  {
    id: 'book_20',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    emoji: '🔮',
    genre: 'Fiction & Literature',
    description: 'A fable about following your dream and listening to your heart.',
    chapters: [
      {
        title: 'Chapter 1: The Shepherd Boy',
        content: `The boy's name was Santiago. He was a shepherd boy who loved traveling and reading. He slept with his flock in abandoned churches, dreaming of treasure near the Egyptian Pyramids. He learns to listen to the language of the world to follow his Personal Legend.`
      }
    ]
  }
];
