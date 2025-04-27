document.addEventListener('DOMContentLoaded', () => {
    console.log("IESconnect Forum Loaded");

    // --- Elements ---
    const userProfileToggle = document.getElementById('user-profile-toggle');
    const userDropdown = document.getElementById('user-dropdown');
    const createPostBtnSidebar = document.getElementById('create-post-btn-sidebar');
    const createPostBtnMobile = document.getElementById('create-post-btn-mobile');
    const topicLinks = document.querySelectorAll('.topic-link');
    const mainFeed = document.querySelector('.main-feed'); 
    let allPosts = mainFeed ? Array.from(mainFeed.querySelectorAll('.post')) : []; 
    const searchBar = document.querySelector('.search-bar'); 
    // Comment Modal Elements
    const commentModalOverlay = document.getElementById('comment-modal-overlay');
    const commentModal = document.getElementById('comment-modal');
    const closeCommentModalBtn = document.getElementById('close-comment-modal');
    const modalPostTitle = document.getElementById('modal-post-title');
    const modalPostBody = document.getElementById('modal-post-body');
    const modalPostInfo = document.getElementById('modal-post-info');
    const modalCommentsList = document.getElementById('modal-comments-list');
    const submitCommentBtn = document.querySelector('.btn-submit-comment');
    // Create Post Modal Elements
    const createPostModalOverlay = document.getElementById('create-post-modal-overlay');
    const createPostModal = document.getElementById('create-post-modal');
    const closeCreatePostModalBtn = document.getElementById('close-create-post-modal');
    const createPostForm = document.getElementById('create-post-form');
    // Right Sidebar Sections
    const defaultSidebarSections = document.querySelectorAll('.default-sidebar-section');
    const topicSpecificSidebarSections = document.querySelectorAll('.topic-specific-section');
    const subForumsSection = document.getElementById('sub-forums-section');
    const similarTopicsSection = document.getElementById('similar-topics-section');
    const subForumList = subForumsSection?.querySelector('.sub-forum-list');
    const similarTopicList = similarTopicsSection?.querySelector('.similar-topic-list');

    // --- State ---
    let currentTopicFilter = 'all'; 


    // --- Mock Data ---
    const mockComments = {
        "post-1": [
            { user: "MetroMover", avatar: "fas fa-subway", timestamp: "2h", body: "Definitely check out apartments near Porta Romana or Crocetta metro stops. Easy commute!" },
            { user: "PastaPilot", avatar: "fas fa-plane", timestamp: "1h", body: "I lived near Piazza Cinque Giornate, about a 15-20 min walk or short tram ride. Lots of supermarkets and stuff around." },
            { user: "GelatoGuardian", avatar: "fas fa-ice-cream", timestamp: "30m", body: "Thanks for the tips everyone!" }
        ],
        "post-2": [
             { user: "BookwormBen", avatar: "fas fa-book", timestamp: "20h", body: "Took it last semester! Super interesting content, Prof. Rossi is passionate. Workload is manageable, mostly readings and one big final paper. Grading felt fair." },
             { user: "ArtAppreciator", avatar: "fas fa-palette", timestamp: "15h", body: "Yeah, agree with Ben. It's not an 'easy A' but definitely worth it if you're interested in the subject. The field trips were amazing." }
        ],
        "post-3": [
            { user: "EspressoExplorer", avatar: "fas fa-coffee", timestamp: "4h", body: "Ooh, need the name! Navigli gets packed." },
            { user: "PastaPilot", avatar: "fas fa-plane", timestamp: "3h", body: "It's called 'Bar Magenta's Secret Cousin'... kidding! It's a small place called 'El Brellin's Back Alley'. Seriously good." },
            { user: "FlyingSquirrelMan", avatar: "fas fa-user-circle", timestamp: "1h", body: "Adding it to my list!" }
        ],
        "post-4": [
             { user: "WeekendWarrior", avatar: "fas fa-hiking", timestamp: "7h", body: "Totally doable! Took the train to Verona (about 1.5 hrs), stayed one night, then train to Peschiera del Garda (20 mins). Ferry is great for exploring Lake Garda towns." },
             { user: "HistoryHunter", avatar: "fas fa-landmark", timestamp: "5h", body: "Verona is lovely. Make sure to book Arena tickets in advance if you want to see an opera!" }
        ],
        "post-5": [
             { user: "RomanRemains", avatar: "fas fa-archway", timestamp: "1d", body: "Brescia! Has amazing Roman ruins (Capitolium, Theatre) and the Santa Giulia museum complex is incredible (UNESCO site). Easy train ride." },
             { user: "CastleExplorer", avatar: "fas fa-chess-rook", timestamp: "1d", body: "Pavia is also great, has a beautiful Certosa (monastery) and a historic university." }
        ],
        "post-6": [
            { user: "LibraryLurker", avatar: "fas fa-book-reader", timestamp: "15h", body: "Try 'oTTo' in Sarpi (Chinatown, but close enough). Chill vibe, good drinks." },
            { user: "WineWizard", avatar: "fas fa-wine-glass-alt", timestamp: "10h", body: "There's a place in Brera called 'N'ombra de Vin', downstairs is quieter and has a great wine selection." }
        ],
        "post-7": [
             { user: "NewbieNavigator", avatar: "fas fa-map-signs", timestamp: "2d", body: "Whoa, thanks for the heads-up! Didn't even realize that was a thing." },
             { user: "FineFighter", avatar: "fas fa-shield-alt", timestamp: "1d", body: "Yeah, the controllers (ATM staff in uniform) can be strict. Always validate!" }
        ],
         "post-8": [
             { user: "ItalianaVera", avatar: "fas fa-pizza-slice", timestamp: "20h", body: "Ciao! I'm Italian and need to practice my English. Sent you a DM!" },
             { user: "LanguageLearner", avatar: "fas fa-comments", timestamp: "18h", body: "Check out the Tandem app too, lots of people in Milan looking for exchanges." }
        ],
        "post-9": [
             { user: "CaffeineCraver", avatar: "fas fa-mug-hot", timestamp: "3h", body: "OMG need this! My apartment is too noisy to study." },
             { user: "BookwormBen", avatar: "fas fa-book", timestamp: "1h", body: "Libri & Caffè? Been there! It's tiny but super cozy. Good find!" }
        ],
        "post-10": [
             { user: "InfoGuru", avatar: "fas fa-info-circle", timestamp: "20h", body: "Yep, there's one near the admin office. Ask the staff, they can point you to it. I think it costs a few cents per page." },
             { user: "AlumniAdvisor", avatar: "fas fa-user-tie", timestamp: "15h", body: "Alternatively, there are many 'copisteria' shops around Milan that offer printing services relatively cheaply." }
        ],
        "post-11": [
            { user: "SliceSeeker", avatar: "fas fa-pizza-slice", timestamp: "8h", body: "Try Princi Bakery near Cordusio, they have great focaccia pizza slices." },
            { user: "FoodieFiorenza", avatar: "fas fa-utensils", timestamp: "5h", body: "Seconding Princi! Also, there's a tiny place called 'Mr. Panozzo' just off Via Torino that's surprisingly good." }
        ],
        "post-12": [
            { user: "BudgetExplorer", avatar: "fas fa-euro-sign", timestamp: "1d", body: "Good tip! Also sign up for their newsletters, sometimes they have promo codes." },
            { user: "SpeedySaver", avatar: "fas fa-tachometer-alt", timestamp: "18h", body: "Italo often has better 'comfort' levels for similar prices too (Prima vs Standard)." }
        ],
        "post-13": [
            { user: "LegalEagle", avatar: "fas fa-gavel", timestamp: "20h", body: "4+4 is very standard for long-term rentals ('contratto a canone libero'). It means it renews automatically after 4 years for another 4 unless you give proper notice (usually 6 months before expiry). Ask for an English summary if possible, or use Google Translate carefully." },
            { user: "BeenThere", avatar: "fas fa-key", timestamp: "15h", body: "Check clauses about 'spese condominiali' (building fees) - are they included or separate? Also, deposit amount ('cauzione') - usually 2-3 months rent." }
        ],
        "post-14": [
            { user: "StyleStudent", avatar: "fas fa-tshirt", timestamp: "5h", body: "Took it last year! Professor Bianchi is knowledgeable. It's mostly lectures, but we did have one guest speaker from a fashion house and a visit to the Armani Silos museum. Interesting if you like fashion history/business." },
            { user: "MarketingMajor", avatar: "fas fa-chart-line", timestamp: "3h", body: "Found it a bit dry, more academic than I expected. But the final project on brand analysis was cool." }
        ],
        "post-15": [
            { user: "IESInternHelper", avatar: "fas fa-briefcase", timestamp: "3d", body: "The IES internship team can definitely help provide resources and contacts, reach out to them! LinkedIn is also crucial here, connect with people in industries you're interested in." },
            { user: "NetworkNinja", avatar: "fas fa-users", timestamp: "2d", body: "Go to industry events if possible, even small ones. Aperitivo events can be good for informal networking. Italians value personal connections." }
        ],
    };

    const topicDetails = {
        "housing": {
            subForums: ["Apartment Hunting", "Residences", "Neighborhoods", "Contracts", "Utilities"],
            similarTopics: ["Transportation", "Campus Life", "Hidden Gems"]
        },
        "classes": {
            subForums: ["Course Reviews", "Study Tips", "Registration", "Professors", "IES Center Resources"],
            similarTopics: ["Campus Life", "Internships", "Language Exchange"]
        },
        "food-drink": {
            subForums: ["Restaurants", "Aperitivo", "Cafes", "Pizza", "Gelato", "Quick Eats", "Groceries"],
            similarTopics: ["Nightlife", "Hidden Gems", "Places to See"]
        },
        "trips": {
            subForums: ["Day Trips", "Weekend Getaways", "Train Travel", "Budget Travel", "International", "IES Trips"],
            similarTopics: ["Places to See", "Transportation", "Hidden Gems"]
        },
        "places-to-see": {
            subForums: ["Museums", "Parks", "Historical Sites", "Architecture", "Beyond Milan"],
            similarTopics: ["Trips", "Hidden Gems", "Transportation"]
        },
         "hidden-gems": {
            subForums: ["Quiet Spots", "Unique Shops", "Local Markets", "Street Art", "Secret Views"],
            similarTopics: ["Food & Drink", "Places to See", "Nightlife"]
        },
         "nightlife": {
            subForums: ["Bars", "Clubs", "Live Music", "Navigli", "Brera", "Isola"],
            similarTopics: ["Food & Drink", "Hidden Gems", "Trips"]
        },
         "language-exchange": {
            subForums: ["Find Partners", "Tandem Events", "Language Schools", "Practice Resources", "Italian Slang"],
            similarTopics: ["Classes", "Campus Life", "Internships"]
        },
         "internships": {
            subForums: ["Finding Placements", "Resume/CV Help", "Interview Tips", "IES Program", "Post-Graduation"],
            similarTopics: ["Classes", "Language Exchange", "Campus Life"]
        },
         "campus-life": {
            subForums: ["IES Center", "Student Events", "Clubs/Groups", "Making Friends", "Adjusting to Milan"],
            similarTopics: ["Housing", "Classes", "Language Exchange"]
        },
         "transportation": {
            subForums: ["Metro/Tram/Bus", "ATM Card", "Bike Sharing", "Walking Routes", "Airports"],
            similarTopics: ["Housing", "Trips", "Places to See"]
        }
    };

    // --- Functions ---

    function generateMockCommentsHTML(comments) {
        if (!comments || comments.length === 0) {
            return '<p class="no-comments">No comments yet.</p>';
        }
        return comments.map(comment => `
            <div class="comment">
                <div class="comment-info">
                    <span class="comment-avatar"><i class="${comment.avatar || 'fas fa-user-circle'}"></i></span>
                    <span class="comment-author">${comment.user}</span>
                    <span class="comment-timestamp">${comment.timestamp}</span>
                </div>
                <p class="comment-body">${comment.body}</p>
            </div>
        `).join('');
    }

    function displayComments(postId) {
        const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
        if (!postElement) return;

        const title = postElement.querySelector('.post-title a')?.textContent || 'Post';
        const body = postElement.querySelector('.post-body')?.innerHTML || '';
        const postInfoHTML = postElement.querySelector('.post-info')?.innerHTML || '';
        const comments = mockComments[postId] || [];

        modalPostTitle.textContent = title;
        modalPostBody.innerHTML = body;
        modalPostInfo.innerHTML = postInfoHTML;
        const badgeInModal = modalPostInfo.querySelector('.badge');
        if (badgeInModal) {
        }

        modalCommentsList.innerHTML = generateMockCommentsHTML(comments);

        commentModalOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideComments() {
        commentModalOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    function displayCreatePostModal() {
        createPostModalOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideCreatePostModal() {
        createPostModalOverlay?.classList.remove('active');
        document.body.style.overflow = '';
        // Optionally clear form fields
        if (createPostForm) {
             createPostForm.reset();
        }
    }

    function generateListItems(items, baseHref = "subforum.html?sub=", linkType = "subforum") {
        if (!items || items.length === 0) {
            return '<li>No related items found.</li>';
        }
        // Encode the item name for the URL parameter
        return items.map(item => `<li><a href="${baseHref}${encodeURIComponent(item)}">${item}</a></li>`).join('');
    }

    // --- Event Listeners ---

    // User Profile Dropdown Toggle
    userProfileToggle?.addEventListener('click', (event) => {
        event.stopPropagation();
        userDropdown?.classList.toggle('show');
        userProfileToggle.classList.toggle('active');
    });

    // Close dropdown if clicking outside
    document.addEventListener('click', (event) => {
        if (userDropdown?.classList.contains('show') && !userProfileToggle.contains(event.target)) {
            userDropdown.classList.remove('show');
            userProfileToggle.classList.remove('active');
        }
    });

    // Create Post button (placeholder action)
    createPostBtnSidebar?.addEventListener('click', () => {
        displayCreatePostModal();
    });

    createPostBtnMobile?.addEventListener('click', () => {
        displayCreatePostModal();
    });

    // Vote buttons
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postElement = btn.closest('.post');
            const voteCountElement = postElement?.querySelector('.vote-count');
            let currentCount = parseInt(voteCountElement?.textContent || '0');
            const isActive = btn.classList.contains('active');
            const isUpvote = btn.classList.contains('upvote');
            const sibling = isUpvote ? btn.parentElement?.querySelector('.downvote') : btn.parentElement?.querySelector('.upvote');

            if (isActive) {
                btn.classList.remove('active');
                voteCountElement.textContent = isUpvote ? currentCount - 1 : currentCount + 1;
            } else {
                 if (sibling?.classList.contains('active')) {
                     sibling.classList.remove('active');
                     voteCountElement.textContent = isUpvote ? currentCount + 2 : currentCount - 2;
                 } else {
                    voteCountElement.textContent = isUpvote ? currentCount + 1 : currentCount - 1;
                 }
                 btn.classList.add('active');
            }
        });
    });

    // Save buttons
    document.querySelectorAll('.save-btn').forEach(btn => {
         const icon = btn.querySelector('i');
         if (btn.classList.contains('saved')) {
             icon?.classList.remove('far');
             icon?.classList.add('fas');
             btn.innerHTML = `<i class="fas fa-bookmark"></i> Saved`;
         } else {
             icon?.classList.remove('fas');
             icon?.classList.add('far');
              btn.innerHTML = `<i class="far fa-bookmark"></i> Save`;
         }

        btn.addEventListener('click', () => {
            const isSaved = btn.classList.toggle('saved');
            const icon = btn.querySelector('i');
            if (isSaved) {
                btn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                icon?.classList.remove('far');
                icon?.classList.add('fas');
            } else {
                 btn.innerHTML = '<i class="far fa-bookmark"></i> Save';
                 icon?.classList.remove('fas');
                 icon?.classList.add('far');
            }
        });
    });

    // Comment buttons -> Open Modal
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault(); 

            const postElement = btn.closest('.post');
            const postId = postElement?.dataset.postId;
            if (postId) {
                displayComments(postId);
            } else {
                console.error("Could not find post ID for comment button.");
            }
        });
    });

    // Close Comment Modal Listener
    closeCommentModalBtn?.addEventListener('click', hideComments);
    commentModalOverlay?.addEventListener('click', (event) => {
        if (event.target === commentModalOverlay) {
            hideComments();
        }
    });

    // Optional: Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && commentModalOverlay?.classList.contains('active')) {
            hideComments();
        }
    });

    // Mock Submit Comment
    submitCommentBtn?.addEventListener('click', () => {
        const textarea = commentModal.querySelector('.add-comment textarea');
        const commentText = textarea.value.trim();
        if (commentText) {
            const newComment = {
                 user: "You (FlyingSquirrelMan)", 
                 avatar: "fas fa-user-circle",
                 timestamp: "Just now",
                 body: commentText
            };
             const commentHTML = generateMockCommentsHTML([newComment]); 
             modalCommentsList.insertAdjacentHTML('beforeend', commentHTML); 
             textarea.value = ''; 
             modalCommentsList.scrollTop = modalCommentsList.scrollHeight; 
              const noCommentsP = modalCommentsList.querySelector('.no-comments');
              if (noCommentsP) {
                  noCommentsP.remove();
              }
        } else {
            alert("Please enter a comment.");
        }
    });

    // Check for post body overflow and add fade effect class
    document.querySelectorAll('.post-body').forEach(body => {
        setTimeout(() => {
             if (body.scrollHeight > body.clientHeight) {
                body.classList.add('overflowing');
            } else {
                 body.classList.remove('overflowing');
            }
        }, 50); 
    });

    // Close Create Post Modal Listener
    closeCreatePostModalBtn?.addEventListener('click', hideCreatePostModal);
    createPostModalOverlay?.addEventListener('click', (event) => {
        if (event.target === createPostModalOverlay) {
            hideCreatePostModal();
        }
    });

    // Handle Create Post Form Submission (Mock)
    createPostForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(createPostForm);
        const title = formData.get('title');
        const body = formData.get('body');
        const subforum = formData.get('subforum');
        const topic = formData.get('topic');
        const flair = formData.get('flair');

        console.log("New Post Submitted (Mock):");
        console.log({ title, body, subforum, topic, flair });

        // In a real app, you would send this data to the server
        // and then likely add the new post to the top of the feed dynamically.
        // For now, just show an alert and close the modal.

        alert(`Post "${title}" created in ${subforum}! (Mock)`);
        hideCreatePostModal();
    });

    // --- Topic Filtering ---
    topicLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 

            const selectedTopic = link.dataset.topic;

            topicLinks.forEach(l => l.classList.remove('active-topic'));
            link.classList.add('active-topic');

            allPosts.forEach(post => {
                const postTopic = post.dataset.topic;
                if (selectedTopic === 'all' || postTopic === selectedTopic) {
                    post.classList.remove('hidden');
                } else {
                    post.classList.add('hidden');
                }
            });
            updateRightSidebar(selectedTopic);
            console.log(`Filtered by topic: ${selectedTopic}`);
        });
    });

    function updateRightSidebar(topic) {
        if (topic === 'all') {
            defaultSidebarSections.forEach(sec => sec.classList.remove('hidden-section'));
            topicSpecificSidebarSections.forEach(sec => sec.classList.add('hidden-section'));
            console.log("Showing default sidebar");
        } else {
            defaultSidebarSections.forEach(sec => sec.classList.add('hidden-section'));
            topicSpecificSidebarSections.forEach(sec => sec.classList.remove('hidden-section'));

            const details = topicDetails[topic];
            if (details && subForumList && similarTopicList) {
                subForumList.innerHTML = generateListItems(details.subForums);
                similarTopicList.innerHTML = generateListItems(details.similarTopics);
                console.log(`Showing sidebar for topic: ${topic}`);
            } else {
                subForumList.innerHTML = '<li>Sub-forums not available.</li>';
                similarTopicList.innerHTML = '<li>Similar topics not available.</li>';
                console.warn(`No sidebar details found for topic: ${topic}`);
            }
        }
    }
});