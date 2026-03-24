export const questions = [
  {
    id: 1, type: 'single',
    text: 'The day everything started… do you remember when?',
    hint: 'Write in dd/mm/yyyy format',
    placeholder: 'dd/mm/yyyy',
    validate: (ans) => {
      const a = ans.trim();
      return a === '25/09/2022' || a === '25/9/2022';
    },
    correctMsg: "Exactly... The best day of my life… I could never forget it, and I knew you wouldn't either ❤️",
    wrongMsg: "Wait, are you testing me? Try again, my love… I know you remember the exact day we became 'us' 🧿",
    confetti: ['💍', '🎊', '✨', '💎', '🎉', '💍']
  },
  {
    id: 2, type: 'triple',
    text: 'To the world, you are Subhalaxmi... But to me, you are my...',
    hint: 'Fill in my top 3 favourite nicknames for you',
    placeholders: ['Nickname 1', 'Nickname 2', 'Nickname 3'],
    validate: (answers) => {
      const n = answers.map(a => a.toLowerCase().trim());
      return n.some(a => a === 'nandu') &&
             n.some(a => a === 'chopstick' || a === 'chopsticks') &&
             n.some(a => a === 'marshmallow');
    },
    correctMsg: 'Yes! No one else in the world will ever get to call you those names 😤',
    wrongMsg: 'Not quite! Think sweeter... and maybe a little thinner😉 Try again!',
    confetti: ['❤️', '🥢', '🍡', '🎊', '✨']
  },
  {
    id: 3, type: 'single',
    text: 'Your first nickname for me… the one that is stuck in my head forever',
    hint: '',
    placeholder: 'Type the nickname...',
    validate: (ans) => {
      const n = ans.toLowerCase().replace(/[^a-z]/g, '');
      return n === 'mrmafia' || n === 'mafia';
    },
    correctMsg: 'Exactly… You thought I was so intimidating back then, little did you know I was already melting for you 😙',
    wrongMsg: 'Nope! Think back to the very first vibe I gave off, It was a little... dangerous 😉',
    confetti: ['🕴️', '😎', '🎊', '✨', '🎉']
  },
  {
    id: 4, type: 'single',
    text: 'What was the subject of our first project we did together at my "Sasural"?',
    hint: 'Basically you did everything I just kept looking at you... Hehe',
    placeholder: 'The subject was...',
    validate: (ans) => ans.toLowerCase().trim() === 'physics',
    correctMsg: "Yep! To this day, I don't know a single thing about that project, only how beautiful you looked while doing it 😘",
    wrongMsg: "Haha no! To be fair, I don't blame you for forgetting, neither of us were really focused on the actual work... Try again! 😂",
    confetti: ['📏', '📊', '🔋', '🎊', '✨']
  },
  {
    id: 5, type: 'single',
    text: 'We definitely bought tickets to a movie once, but spent the whole time being lost in each other and completely ignoring the screen. What movie were we supposed to be watching?',
    hint: '',
    placeholder: 'The movie was...',
    validate: (ans) => {
      const n = ans.toLowerCase().trim();
      return n === 'pathan' || n === 'pathaan';
    },
    correctMsg: 'Exactly... Shah Rukh Khan had absolutely nothing on us that day…❤️',
    wrongMsg: 'Not quite! Hint: It was a massive action movie, but we were way too busy with our own romance to care 😂❤️',
    confetti: ['🎬', '📹', '🎫', '🎊', '✨']
  },
  {
    id: 6, type: 'double', isFinal: true,
    text: 'You know I am obsessed with all of you, but what are the two things I can never stop looking at?',
    hint: '',
    placeholders: ['Thing 1', 'Thing 2'],
    validate: (answers) => {
      const n = answers.map(a => a.toLowerCase().trim());
      return n.some(a => a === 'eyes') && n.some(a => a === 'smile');
    },
    correctMsg: 'Yes… The smile that lights up my world, and those eyes I could get lost in forever ❤️🧿',
    wrongMsg: 'Honestly, everything about you is perfect, but I am looking for the two specific things I always compliment you on! Try again',
    confetti: ['👀', '😊', '😍', '✨', '💕']
  }
];
