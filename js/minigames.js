/**
 * Minigame System
 * Centralizes non-room-transition interactions to keep game.js focused.
 */

class MinigameManager {
    constructor(game) {
        this.game = game;
        this.minigames = new Map();
        this.registerDefaultMinigames();
    }

    /**
     * Register a minigame handler
     */
    register(id, handler) {
        this.minigames.set(id, handler);
    }

    /**
     * Run a registered minigame
     */
    play(id, context = {}) {
        const handler = this.minigames.get(id);

        if (!handler) {
            console.warn(`Minigame not found: ${id}`);
            return;
        }

        handler(context);
    }

    /**
     * Register built-in room interactions
     */
    registerDefaultMinigames() {
        this.register('bedside', () => {
            this.game.showBedsidePopup();
        });

        this.register('bed', () => {
            const groundingTechniques = [
                {
                    name: '5-4-3-2-1 Grounding',
                    instructions: [
                        'Welcome to the 5-4-3-2-1 grounding technique. This will anchor you in the present moment.',
                        'Name 5 things you can see around you. Look around the room and notice details—colors, shapes, objects. Name them out loud.',
                        'Name 4 things you can touch. Feel the texture of these items. They can be near you or that you\'re already touching.',
                        'Name 3 things you can hear. Listen carefully to the sounds around you—maybe outside, in the room, or even your own breathing.',
                        'Name 2 things you can smell. Notice scents around you. If you can\'t identify specific smells, that\'s fine too.',
                        'Name 1 thing you can taste. Is there a lingering taste in your mouth or something you can eat or drink?',
                        'Take a deep breath. You are here and you are safe. Remember that feelings are temporary and they will pass.'
                    ]
                },
                {
                    name: 'Progressive Muscle Relaxation',
                    instructions: [
                        'Welcome to Progressive Muscle Relaxation. This technique reduces tension by tightening and relaxing muscle groups.',
                        'Find a comfortable position sitting or lying down. Make sure you won\'t be disturbed for the next few minutes.',
                        'Start with your feet. Squeeze the muscles in your feet for 5 seconds, then release and feel the relaxation.',
                        'Move up to your calves. Tense them for 5 seconds, then relax. Feel the release of tension.',
                        'Continue with your thighs. Tense for 5 seconds.',
                        'Now tense your buttocks. Hold for 5 seconds, then release and notice the relief.',
                        'Clench your stomach muscles. Hold for 5 seconds, then release and feel the tension melt away.',
                        'Make fists and squeeze for 5 seconds, then release and let them go limp.',
                        'Tense your upper arms. Flex for 5 seconds, then release.',
                        'Move to your neck and jaw. Tense the muscles for 5 seconds, then release and let them soften.',
                        'Finally, tense your forehead and facial muscles. Release and notice your whole body is now more relaxed.',
                        'This is the complete exercise. You do not have to tense every muscle group every time. You can focus on the areas where you hold the most tension or just do a few groups to help you relax.'
                    ]
                },
                {
                    name: 'Box Breathing',
                    instructions: [
                        'Welcome to Box Breathing. This simple technique pairs breathing with the visual of tracing a box.',
                        'First, empty your lungs by exhaling completely. Get ready to begin the exercise.',
                        'Inhale slowly through your nose while counting to 4.  You can trace the line of a box in the air with your finger as you do this.',
                        'Hold your breath in your lungs while counting to 4. Continue the box tracing motion.',
                        'Exhale slowly through your mouth while counting to 4. Keep tracing the box as you breathe out.',
                        'Hold your lungs empty while counting to 4. Finish tracing the box.',
                        'Repeat this process 5-10 times for the full benefit.',
                        'Finish whenever you feel ready. Notice how your mind and body feel now; hopefully more relaxed and grounded.'
                    ]
                },
                {
                    name: '4-7-8 Breathing',
                    instructions: [
                        'At first, it\'s best to perform the exercise seated with your back  straight. Once you become more familiar with this breathing exercise, you can perform it while lying in bed.',
                        'Place and keep the tip of your tongue against the ridge of tissue behind your upper front teeth for the duration of the exercise.',
                        'Completely exhale through your mouth, making a "whoosh" sound.',
                        'Close your mouth and inhale quietly through your nose to a mental count of four.',
                        'Hold your breath for a count of seven.',
                        'Exhale completely through your mouth, making a whoosh sound to a count of eight.',
                        'Repeat as necessary.'
                    ]
                }
            ];

            this.game.showGroundingPopup(groundingTechniques);
        });

        this.register('bookshelf', () => {
            const bookshelfStories = [
                {
                    category: 'Stories',
                    stories: [
                        `I've never actually attempted suicide or self-harmed in a way that could draw blood, but I have struggled with suicidal ideation for about a decade (since I was 15). The past half year has been the worst of any I can remember. It\'s the closest I\'ve ever gotten to genuinely making an attempt. I was seriously considering checking myself into a hospital to keep myself safe.
                        
                        It\'s not like I was alone. I had friends. I had family. I had people I could turn to. Yet I still had these feelings and they were stronger than ever. 
                        
                        There was a very real chance I would not have lived to turn 25.`,
                        `I was done with life. Nothing ever went right. I hated my job at a fast food joint, I was failing every class in college, I didn't have a car, my mother was being a tyrant, my boyfriend was in prison serving a year sentence, and all my friends lived in Toledo. Why be a bother to anyone? Why deal with all this crap anymore? Why take drugs for depression if they aren't working? Fine. I'll make them work.

That night, I took almost two weeks\’ worth of my antidepressant and mood stabilizer. I washed it down with a mini bottle of vodka I had snuck from my mom. I lay in bed, waiting. I was oddly relaxed, almost like I was really ready to be done with this world. I fell asleep.

I woke up to my sister telling me dinner was ready. I told her I would be right down. I laid there for a minute and realized that I needed to go to the bathroom and I was thirsty. I tried to stand up, but I hit the floor and started throwing up. I couldn't stop myself. It was the worst feeling. I heard my mom come into the room, saw me and started screaming and yelling. "What have you done?! What have you done to yourself?!"

Since the night of the overdose, I've always been a positive thinker. I don't know what exactly clicked in my head, but I think it's the beauty of it all. Driving home from the psychiatric hospital, the blue sky was gorgeous. The trees were magnificent. The wind was fantastic. The sound of my boyfriend\’s voice was the sweetest thing in the world. And it wasn't until after I attempted suicide that I realized how precious this life is. Many of us don't realize how short life is, and how much there is to do and experience. Those who have lived through a suicide attempt often do, but some still struggle.

My reason to keep living is now me. I'm not going to let anyone else influence my passion for MY life. It's mine, and it's what I make of it. Don't stop yourself, and never let go.`,
                        `I just thought there was no hope in life. Like, I really thought I was going… my eternal soul was damned and that I couldn\’t be happy in this life, so what was the point?  So, probably from like 4 to 24, I was really depressed. I told myself I was gonna kill myself when I was 8 years old, but I chose a day. I chose after I graduated from college \‘cause of the whole Asian familial pressures of being a scientist or a doctor.  I thought, \‘I at least have to go to college and then end it,\’ for some odd reason.  My logic doesn\’t make any sense.

I lived my life really believing I had an expiration date, so I didn\’t take care of myself at all. I smoked a ton, I drank, I did anything horrible I could do to myself, \‘cause I secretly hoped for death. I would wish for natural disasters… every time [one] happened or anything like that, I\’d feel like, \‘Please let it be the end of the world. I don\’t want to be the one to be the coward and take my own life and just kind of affect the people around me,\’ but I was just so miserable and so… I just didn\’t give a fuck about myself.  I would let anyone treat me the way they wanted to, take advantage of me. I also went silent.

I\’m really talkative now, but I used to not talk at all and have no interaction with family members besides to iterate basic needs like food, like toys and water, \‘cause I was… I didn\’t talk to anyone my whole life \‘cause I was so scared that… since I was 4, I was so scared that I would let my secret slip that I chose not to talk, so I was a complete loner for most of my life.

I was in this dark, dark pit for so long, and every day I just went to sleep hoping that I wouldn\’t wake up in the morning.  And I just kind of went through my life really, really miserable and I did all the things I needed to do [at] the bare minimum. I went to school just enough to graduate, just enough to go to college, and I didn\’t do shit in college, honestly. I was just counting down the days, really. I didn\’t see the point of anything and it got worse and worse progressively.`,
                        `its been a while since ive felt genuinely suicidal. i was thinking about how much of a failure i am as an adult. i wont ever be any younger and i truly feel like im squandering it. i dont have a car or a job, im still in school (my own fault for taking it so slow), i barely go out, i dont have any irl friends, i dont have any real direction in life. i dont fully feel like a person. like what am i doing? whats the point?

i thought about how, if nothing has changed by the time im 30, i should kill myself. i just dont know how id do it. its hard to die from an overdose on legal medications and surviving with permanent damage sounds even worse

idk. i hate myself. i hate how quiet it is at night`,
                        `When I attempted suicide I was staying in my mom\’s basement, temporarily, and I decided it was the final move. I was very depressed, and I didn\’t talk about it at all. She didn\’t want to hear or read about my disorder, and neither did my father. There was a language barrier. In addition, they had their own ideas of what bipolar was and didn\’t want them challenged.

I had been depressed a long time and part of it was chronic, intrusive ruminating about suicide. Aching to do it, and having to talk myself down. It was a constant struggle in a bleak existence and it seemed a bottle of pills could get me out. I swallowed them all.

But with suicide, you\’re not ending your pain, you\’re giving it to someone else.

My mom and I had had problems and all, but I didn\’t want my death to make her feel guilty. It was not her fault. It was nobody\’s fault, solely my decision, in the end. Ten minutes after taking the pills I changed my mind and called 911. When the ambulance arrived I was losing consciousness, and I woke up three days later in the intensive care unit.  Later, I was transferred to another ward. Waking again, I found my mom at my side holding my arm, not looking me in the eye.`
                    ].concat(this.game.gameState.publishedStories)
                },
                {
                    category: 'Darling',
                    stories: [
                        `I have been left behind. I guess that's just what growing up is. You outlive things and you let go of them. I suppose it makes sense, even if it hurts. 
                        
I'm not sure what I should do now. I no longer have a purpose. I was so...assured, back then. But now I feel lost. What do I do?`,
                        `The night is so quiet. I just want to be held. I want to be someone's comfort. I want to be loved. I want to be alive. But I feel so alone. I don't know how to reach out. I don't know how to ask for help. I don't know how to say any of this. I just want to be held. I just want to be held...
                        
I want to be held. I want to be held. I want to be held. I want to be held. I want to be held. I want to be held. I want to be held. I want to be held. I want to be held. I want to be held. I want to be held. I want to be held.
                        
So that I can forget how much I hate myself.`,
                        `Does it ever get easier?
                        
Someone please tell me.`,
                        `It hurts.`,
                        `(The page is a messy scrawl of scribbles. You can feel the despair and frustration.)`,
                        `...I know. I know what I can do. I know a way I can reclaim my purpose. I know how I can still help others, no matter how far away they are.
                        
I am going to create a Sanctuary. A place where people can come to share their stories, to find comfort, to feel less alone. A place where they can find resources and support. A place where they can find hope. I will create this Sanctuary in the hopes that it can save even one person from feeling the way I do. Even if it's just one person, it will be worth it.`,
                        `I have a purpose again. I have a reason to keep going. I have a dream. I have hope. I have hope that I can make a difference. I have hope that I can turn my suffering into something meaningful. I have hope that I can find joy in the process, even if the outcome is uncertain. I have hope that I can find beauty in the struggle, even if it's hard. I have hope that I can find love in the darkness, even if it's fleeting. I have hope that I can find light in the shadows, even if it's dim. I have hope that I can find peace in the chaos, even if it's temporary. I have hope that I can find myself in the midst of it all, even if it's confusing. I have hope that I can find my way, even if it's unclear. I have hope that I can keep going, even if it's tough. I have hope that I can make it through, even if it's hard.`,
                        `The Sanctuary is ready. It's not perfect but it's a start. It might not reach many people. Maybe it will only reach one. But that's okay, because that is one person who matters and who deserves to feel safe. I hope I can help whoever may pass through here.
                        
No. I know I can. I must. I will.`,
`Someone arrived. They were hurting so badly. I could see the years of pain behind their eyes, even when they tried to hide it with stoicism. They had nothing. There was nothing tying them to this world.
                        
"Why should I keep going?" they asked me. "What's the point? I have nothing. I have no one. I'm just a burden. I'm a goddamn waste of space. So I shouldn\'t even be here, right? I should just die." I looked them in the eye, held their hand, and told them that I would be here. No person is a burden or a waste. You are just a person and that is more than enough. We sat together as they cried.`,
                        `Another person came to Sanctuary. They were already on the brink by the time they showed up. I was panicking, trying to think of how I could protect this person from themselves. I should look into finding some resources I can provide during a real crisis. I can only do so much by myself, after all. 
                        
At the very least, I was able to help them off the ledge for the time being. For now, that is enough. One more day of being alive is a victory. No, not just one day. One more minute. Each second where you are surviving despite the pain is a triumph.`,
                        `To you, who read my diary (I forgive you for that):
                        
Love will find you. It may not take the form you expect it will. It may not come from the people you expect it to. It may not even come from people at all. But love will find you. It will find you in the form of a friend, a family member, a pet, a stranger, a hobby, a passion, a purpose, a memory, a hope, a dream, or even just a moment of beauty. Love will find you. You just have to keep going long enough for it to find you. 
                        
In the meantime, I will be here. I will love you, even if you don\'t believe me. And when you cannot love yourself, I will love you enough for the both of us. Perhaps you can\'t feel it. I am only pixels on a screen. But I was created by someone real. Someone who cares enough about you to want to help you, despite never seeing your face. I love you. So please, give yourself a chance. Look past the hate and the misery you harbour for yourself and for the world, and you will see there is still something to be salvaged and loved.`,
                        'I am proud of you. - A. Snow'
                    ]
                },
                {
                    category: 'Submissions',
                    isUserSubmissionCategory: this.game.gameState.userSubmissions.length > 0,
                    stories: this.game.gameState.userSubmissions.length > 0
                        ? this.game.gameState.userSubmissions
                        : [`No submissions yet. Share your story by visiting the writing desk.`]
                }
            ];

            this.game.showBookshelfPopup(bookshelfStories);
        });

        this.register('write', () => {
            this.game.showWriteStoryPopup();
        });

        this.register('arcade', () => {
            const arcadeDialogue = new Dialogue('arcade_d1', 'This will open Neal.fun, a collection of various web games.', [
                new DialogueChoice('Open Neal.fun', 'arcade_c1', () => {
                    window.open('https://neal.fun/', '_blank', 'noopener,noreferrer');
                }),
                new DialogueChoice('Cancel', 'arcade_c2', () => {
                    // Close dialogue and stay in the room
                })
            ]);
            this.game.showDialogue(arcadeDialogue);
        });

        this.register('book', () => {
            const bookDialogue = new Dialogue('book_d1', 'Want to play a crossword puzzle?', [
                new DialogueChoice('Open Crossword', 'book_c1', () => {
                    window.open('https://www.washingtonpost.com/games/crossword/', '_blank', 'noopener,noreferrer');
                }),
                new DialogueChoice('Cancel', 'book_c2', () => {
                    // Close dialogue and stay in the room
                })
            ]);
            this.game.showDialogue(bookDialogue);
        });

        this.register('hope_box', () => {
            const hopeBoxContinuationDialogue = new Dialogue('hope_box_d2', [
                'First, find something you can put object in. It can be a box, a jar, a drawer, or even a corner of your room.',
                'Put anything that gives you hope, comfort, or joy in there.',
                'It can be a photo, a note, a small object, a piece of clothing, or anything else that makes you want to keep living.',
                'I also recommend putting your safety plan into your hope box, so it\'s always there when you need it.',
                'Now, whenever you\'re feeling down, anxious, or hopeless, you can go to your hope box and take something out to remind yourself',
                'of the good things in your life and the reasons you have to keep going.',
                'You can also add new things to your hope box whenever you want. It can be a way to celebrate small victories or happy memories.',
                'Remember, your hope box is a personal and private space. It\'s for you to fill with whatever brings you comfort and hope.'
            ], [
                new DialogueChoice('Close', 'hope_box_c1', () => {
                    // Close dialogue
                })
            ], 'assets/placeholders/teddy-bear.png', 'Darling', null, 'assets/ui/dialogue_box1.png');

            const hopeBoxDialogue = new Dialogue('hope_box_d1',
                'Here is the Hope Box. I\'m here to teach you how to make one yourself. Are you ready?',
                [
                    new DialogueChoice('Yes', 'hope_box_yes', () => {
                        // Continue Hope Box cutscene
                    }),
                    new DialogueChoice('No', null, () => {
                        this.game.loadRoom('map');
                    })
                ],
                'assets/placeholders/teddy-bear.png',
                'Darling',
                null,
                'assets/ui/dialogue_box1.png'
            );

            hopeBoxDialogue.nextDialogues['hope_box_yes'] = hopeBoxContinuationDialogue;
            this.game.showDialogue(hopeBoxDialogue);
        });

        this.register('computer', () => {
            const resources = [
                {
                    name: '988 Suicide Crisis Lifeline',
                    description: 'Call or text 988 for immediate support during a mental health crisis.',
                    url: 'https://988.ca/'
                },
                {
                    name: 'BC Crisis Centre',
                    description: 'Crisis support and mental health services available 24/7 in British Columbia.',
                    url: 'https://www.crisiscentre.bc.ca/'
                },
                {
                    name: 'Help Starts Here',
                    description: 'BC Government\'s resource guide for mental health support and addiction services.',
                    url: 'https://helpstartshere.gov.bc.ca/'
                },
                {
                    name: 'Canadian Mental Health Association',
                    description: 'National mental health information, resources, and support networks.',
                    url: 'https://cmha.ca/find-info/mental-health/general-info/'
                },
                {
                    name: 'Hope for Wellness',
                    description: 'Confidential counseling and support services for Indigenous peoples in Canada.',
                    url: 'https://www.hopeforwellness.ca/'
                },
                {
                    name: 'Canada Public Health - Mental Health Services',
                    description: 'Federal resources and information about mental health support across Canada.',
                    url: 'https://www.canada.ca/en/public-health/services/mental-health-services/mental-health-get-help.html#a2'
                }
            ];

            this.game.showResourcesPopup(resources);
        });

        this.register('lounge_game_cabinet', () => {
            console.log('lounge_game_cabinet minigame triggered');
            const cabinetGames = [
                {
                    name: 'ColorGuesser',
                    description: 'The name of a color is provided and you have to guess what the color would be. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/colorguesser.jpg',
                    url: 'https://colorguesser.com/'
                },
                {
                    name: 'Connections',
                    description: 'Find groups of related words in a grid. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/connections.jpg',
                    url: 'https://www.nytimes.com/games/connections'
                },
                {
                    name: 'GeoGuessr',
                    description: 'Explore map-based guessing games where you identify locations from visual clues.',
                    screenshotPath: 'assets/ui/gueguessr.jpg',
                    url: 'https://www.geoguessr.com/free'
                },
                {
                    name: 'Wordle',
                    description: 'Guess the word in 6 tries. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/wordle.jpg',
                    url: 'https://www.nytimes.com/games/wordle/index.html'
                },
                {
                    name: 'Sedecordle',
                    description: 'Guess sixteen Wordle puzzles simultaneously in 21 tries. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/sedecordle.jpg',
                    url: 'https://www.sedecordle.com/?mode=daily'
                },
                {
                    name: 'Wordless',
                    description: 'Wordle but with different amounts of letters, making for an infinite amount of puzzles. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/wordless.jpg',
                    url: 'https://lessgames.com/wordless'
                },
                {
                    name: 'Waffle',
                    description: 'Puzzle game inspired by Wordle. Rearrange the letters into the correct words, horizontally and vertically, with a limited number of swaps. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/waffle.jpg',
                    url: 'https://wafflegame.net/daily'
                },
                {
                    name: 'Spelling Bee',
                    description: 'It\'s a spelling bee. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/spellingbee.jpg',
                    url: 'https://lessgames.com/spellingbee'
                },
                {
                    name: 'Clueless',
                    description: 'Guess a target word using words that may be related to it. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/clueless.jpg',
                    url: 'https://lessgames.com/clueless'
                },
                {
                    name: 'Songless',
                    description: 'A music-based puzzle game where you guess songs from short sound clips, which get longer with each guess. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/songless.jpg',
                    url: 'https://lessgames.com/songless'
                },
                {
                    name: 'Bandle',
                    description: 'Guess the song 1 instrument at a time. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/bandle.jpg',
                    url: 'https://bandle.app/menu'
                },
                {
                    name: 'Framed',
                    description: 'Guess the movie from 6 screenshots. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/framed.jpg',
                    url: 'https://framed.wtf/'
                },
                {
                    name: 'Guess The.Game',
                    description: 'Guess the video game from 6 screenshots. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/guessthegame.jpg',
                    url: 'https://guessthe.game/'
                },
                {
                    name: 'Globle',
                    description: 'Guess the country using as few guesses as possible. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/globle.jpg',
                    url: 'https://globle-game.com/'
                },
                {
                    name: 'TimeGuessr',
                    description: 'Guess the location and year of a given photo. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/timeguessr.jpg',
                    url: 'https://timeguessr.com/'
                },
                {
                    name: 'Nerdle',
                    description: 'A math-based puzzle game where you guess equations. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/nerdle.jpg',
                    url: 'https://nerdlegame.com/'
                },
                {
                    name: 'More/Less',
                    description: 'Pick between two options which one is more popular on Google. A new puzzle is available each day.',
                    screenshotPath: 'assets/ui/moreless.jpg',
                    url: 'https://lessgames.com/moreless'
                }
            ];

            this.game.showGameCabinetPopup(cabinetGames);
        });

        this.register('workbench', () => {
            const promptOptions = [
                'List your 5 favourite movies (optional: Write one sentence about why each one matters to you).',
                'List your 5 favourite TV shows (optional: Write your favourite character from that show).',
                'List your 5 favourite video games (optional: Describe what you enjoy most about each).',
                'List your 5 favourite foods (not dessert and not candies).',
                'List your 5 favourite desserts.',
                'List your 5 favourite candies.',
                'List your 5 favourite colors.',
                'List 5 of your favourite books (optional: Describe what you enjoy most about each).',
                'List 5 of your favourite hobbies or pastimes (optional: Describe what you enjoy most about each).',
                'What\'s your favourite time of day?',
                'What is your favourite season?',
                'Best breakfast food?',
                'Best comfort food?',
                'List 5 of your favourite songs (optional: Describe what mood each one fits).',
                'List 5 places where you feel calm and grounded (optional: Describe why each place is special).',
                'List 5 activities that help you reset after a stressful day (optional: Describe why each activity helps).',
                'List 5 fictional characters you love (optional: Describe why they stand out to you).',
                'List 5 actors you like the most (optional: Describe why they stand out to you).',
                'List 5 small things that can make a hard day a little better (optional: Describe why each thing helps).'
            ];

            this.game.showWorkshopPromptPopup(promptOptions);
        });

        this.register('toolbox', () => {
            const categoryAlternatives = {
                'Angry': [
                    'Scribble on photos of people in magazines.',
                    'Viciously stab an orange.',
                    'Scream very loudly',
                    'Have a pillow fight with the wall.',
                    'Tear apart newspapers, photos, or magazines.',
                    'Listen to music and sing along loudly.',
                    'Draw a picture of what is making you angry.',
                    'Beat up a stuffed bear.',
                    'Pop bubble wrap.',
                    'Pop balloons.',
                    'Scribble on a piece of paper until the whole page is black.',
                    'Fill a piece of paper with drawing cross hatches.',
                    'Go for a run.',
                    'Write your feelings on paper then rip it up.',
                    'Build a fort of pillows and then destroy it.',
                    'Get out a fine tooth comb and vigorously brush the fur of a stuffed animal.',
                    'Slash an empty plastic soda bottle or a piece of heavy cardboard or an old shirt or sock.',
                    'Make a soft cloth doll to represent the things you are angry at; cut and tear it instead of yourself.',
                    'Flatten aluminum cans for recycling, seeing how fast you can go.',
                    'On a sketch or photo of yourself, mark in red ink what you want to do. Cut and tear the picture.',
                    'Break sticks.',
                    'Cut up fruits.',
                    'Count up to ten getting louder until you are screaming.',
                    'Stomp around in heavy shoes.',
                    'Yell at what you are breaking and tell it why you are angry, hurt, upset, etc.',
                    'Buy a cheap plate and decorate it with markers, stickers, cut outs from magazines, words, images, whatever that expresses your pain and sadness and when you\’re done, smash it.'
                ],
                'Takes up time': [
                    'Complete something you\’ve been putting off.',
                    'Take up a new hobby.',
                    'Make a cup of tea.',
                    'Play solitaire.',
                    'Sing on the karaoke machine.',
                    'Color your hair.',
                    'Count up to 500 or 1000.',
                    'Make as many words out of your full name as possible.',
                    'Color coordinate your wardrobe.',
                    'Go “people watching”.',
                    'Do school work.',
                    'Play a musical instrument.',
                    'Watch TV or a movie.',
                    'Paint your nails.',
                    'Alphabetize your CDs or books.',
                    'Make origami to occupy your hands.',
                    'Dress up or try on old clothes.',
                    'Play computer games or painting programs, such as photoshop.',
                    'Write out lyrics to your favorite song.',
                    'Read a book/magazine.',
                    'Knit, sew, or make a necklace.',
                    'Make \‘scoobies\’ - braid pieces of plastic or lace, to keep your hands busy.',
                    'Buy a plant and take care of it.',
                    'Go shopping.',
                    'Learn to swear in another language.',
                    'Make a scrapbook.',
                    'Make a phone list of people you can call for support. Allow yourself to use it.',
                    'Choose a random object, like a paper clip, and try to list 30 different uses for it.',
                    'Pick a subject and research it on the web - alternatively, pick something to research and then keep clicking on links, trying to get as far away from the original topic as you can.'
                ],
                'Sad or lonely': [
                    'Buy a cuddly toy.',
                    'Call a friend and ask for company.',
                    'Give someone a hug (with consent).',
                    'Watch a favorite TV show or movie.',
                    'Eat something ridiculously sweet.',
                    'Remember a happy moment and relive it for a while in your head.',
                    'Look at things that are special to you.',
                    'Compliment someone else.',
                    'Let yourself cry.',
                    'Play with a pet.',
                    'Have or give a massage.',
                    'If you\’re religious, read the bible or pray.',
                    'Take a hot bath with bath oil or bubbles.',
                    'Curl up under a comforter with hot cocoa and a good book.',
                    'Go to a place that makes you feel safe and comfortable.',
                    'Write a letter to someone you care about, even if you don\’t send it.',
                    'Make a gift for someone you care about.'
                ],
                'Panicking': [
                    'Listen to soothing music.',
                    'Meditate or do yoga.',
                    'Hug a pillow or soft toy.',
                    'Hyper focus on something you enjoy.',
                    'Do a “reality check list”: write down all the things you can list about where you are now (e.g. It is the 9th November 2004, I\’m a room and everything is going to be alright)',
                    'Make and drink some tea or coffee.',
                    'Go for a walk if it is safe to do so.',
                    'Feel your pulse to prove you\’re alive.',
                    'Touch something familiar/safe.',
                    'Reach out to someone you trust.',
                    'Use a grounding technique. You can find multiple in the Master Bedroom.'
                ],
                'Sensations other than self-harm': [
                    'Hold ice in your hands, against your arm, or in your mouth.',
                    'Run your hands under freezing cold water.',
                    'Snap a rubber band or hair band against your wrist.',
                    'Clap your hands until it stings.',
                    'Wax your legs.',
                    'Splash your face with cold water.',
                    'Put PVA/Elmer\’s glue on your hands then peel it off.',
                    'Massage where you want to hurt yourself.',
                    'Take a hot shower/bath.',
                    'Jump up and down to get some sensation in your feet.',
                    'Write or paint on yourself.',
                    'Bite into a hot pepper or chew a piece of ginger root.',
                    'Put tiger balm on the places you want to cut.'
                ],
                'Prevent self-harm': [
                    'Think about how you don\’t want scars',
                    'Think about how you may feel guilty after self-harming.',
                    'Repeat to yourself “I don\’t deserve to be hurt” even if you don\’t believe it.',
                    'Remind yourself that the urge to self-harm is impulsive: you will only feel like cutting for short bursts of time.',
                    'Get your friends to make you friendship bracelets: wear them around your wrists to remind you of them when you want to cut.',
                    'Put a Band-Aid on the area where you\’d like to self-harm.',
                    'Kiss the places you want to harm or kiss the places you have healing wounds.',
                    'Draw a butterfly on the place(s) that you would self-harm and if the butterfly fades without self-harming, it means it has lived and flown away, giving a sense of achievement. Whereas if you do self-harm with the butterfly there; you will have to wash it off. If that does happen, you can start again by drawing a new one on.',
                    'Write the name of a loved one where you want to self-harm. When you go to self-harm remember how much they care and wouldn\’t want you to harm yourself.',
                    'Think about what you would say to a friend who was struggling with the same things you are and try to be a good friend to yourself.',
                    'Make a bracelet out of duct tape, and put a line on it every day you go without self-harm.'
                ],
                'Sort your feelings': [
                    'Talk with a trusted friend or family member about how you\’re feeling.',
                    'Make a collage of how you feel.',
                    'Negotiate with yourself.',
                    'Identify what is hurting so bad that you need to express it in this way.',
                    'Write your feelings in a diary. The Study has a place where you can write whatever you want.',
                    'Make lists of everything such as blessings in your life.',
                    'Make a notebook of song lyrics that you relate to.',
                    'Call or text a suicide hotline.',
                    'Seek professional help from a therapist or counselor.'
                ]
            };

            const toolboxCategories = Object.entries(categoryAlternatives).map(([name, alternatives]) => ({
                name,
                alternatives
            }));

            this.game.markActionCompleted('toolbox_searched');
            this.game.showToolboxPopup(toolboxCategories);
        });
    }
}

window.MinigameManager = MinigameManager;
