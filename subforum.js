document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subforumName = urlParams.get('sub');

    // --- Elements to Update ---
    const pageTitle = document.querySelector('title');
    const subforumTitleHeading = document.getElementById('subforum-title-heading');
    const aboutSubforumTitle = document.getElementById('about-subforum-title');
    const subforumDescription = document.getElementById('subforum-description');
    const subforumIconContainer = document.getElementById('subforum-icon-container');
    const subforumStatsInfo = document.getElementById('subforum-stats-info');
    const pinnedPostsFeed = document.getElementById('pinned-posts-feed');
    const communityPostsFeed = document.getElementById('community-posts-feed');
    const subforumRulesList = document.getElementById('subforum-rules-list');
    const subforumRelatedLinks = document.getElementById('subforum-related-links');
    // Create Post Modal Elements
    const createPostBtnSubforum = document.getElementById('create-post-btn-subforum');
    const createPostModalOverlay = document.getElementById('create-post-modal-overlay');
    const createPostModal = document.getElementById('create-post-modal');
    const closeCreatePostModalBtn = document.getElementById('close-create-post-modal');
    const createPostForm = document.getElementById('create-post-form');
    const modalSubforumNameSpan = document.getElementById('modal-subforum-name');
    const postSubforumHiddenInput = document.getElementById('post-subforum-hidden');
    // User Profile Dropdown Elements (Copy from script.js if needed, or make common)
    const userProfileToggle = document.getElementById('user-profile-toggle');
    const userDropdown = document.getElementById('user-dropdown');
    // Search Scope Input
    const searchSubforumScopeInput = document.getElementById('search-subforum-scope');

    // --- Mock Data (Example - should be more specific per subforum) ---
    // You would likely fetch this data based on subforumName in a real app
    const subforumData = {
        "Neighborhoods": {
            icon: "fas fa-map-marked-alt",
            description: "Discuss Milan's neighborhoods, find the best areas to live, share safety tips, and discover local gems.",
            members: 1850,
            online: 72,
            rules: ["Share experiences about specific neighborhoods.", "Be respectful of different living situations.", "No real estate advertising (unless specifically allowed)."],
            links: [
                { text: "Numbeo Cost of Living Milan", url: "#", icon: "fas fa-euro-sign" },
                { text: "Idealista Milan Rentals", url: "#", icon: "fas fa-key" }
            ],
            pinnedPosts: [ /* Array of post objects */ ],
            communityPosts: [ /* Array of post objects */ ]
        },
        "Course Reviews": {
            icon: "fas fa-graduation-cap",
            description: "Share your experiences with IES Milan courses, discuss professors, workload, and help others choose their classes.",
            members: 2105,
            online: 95,
            rules: ["Be constructive in your reviews.", "Focus on the course content and teaching style.", "Mention the semester/year if relevant."],
            links: [
                { text: "IES Milan Course Catalog", url: "#", icon: "fas fa-book-open" }
            ],
            pinnedPosts: [ /* Array of post objects */ ],
            communityPosts: [ /* Array of post objects */ ]
        },
        "Aperitivo": {
            icon: "fas fa-cocktail",
            description: "The heart of Milanese social life! Share your favorite aperitivo spots, deals, and experiences.",
            members: 2530,
            online: 115,
            rules: ["Focus on aperitivo (drinks + food buffet).", "Include location/neighborhood if possible.", "Photos welcome!"],
            links: [
                 { text: "Where Milan - Aperitivo Guide", url: "#", icon: "fas fa-newspaper" }
            ],
            pinnedPosts: [ /* Array of post objects */ ],
            communityPosts: [ /* Array of post objects */ ]
        },
         // Add more entries for other subforums...
        "Default": { // Fallback
            icon: "fas fa-comments",
            description: "Welcome to this sub-forum! Share tips, ask questions, and connect with fellow students.",
            members: 500,
            online: 20,
            rules: [],
            links: [],
            pinnedPosts: [],
            communityPosts: []
        }
    };

    // --- Functions ---
    function updatePageContent(name) {
        const data = subforumData[name] || subforumData["Default"];
        const fullTitle = `IES/${name}`;

        // Update basic info
        pageTitle.textContent = `IESconnect - ${fullTitle}`;
        subforumTitleHeading.textContent = fullTitle;
        aboutSubforumTitle.textContent = `About ${fullTitle}`;
        subforumDescription.textContent = data.description;

        // Update Icon
        if (subforumIconContainer) {
            subforumIconContainer.innerHTML = `<i class="${data.icon}"></i>`;
        }

        // Update Stats
        if (subforumStatsInfo) {
             subforumStatsInfo.innerHTML = `
                <span><i class="fas fa-users"></i> ${data.members.toLocaleString()} Members</span>
                <span><i class="fas fa-circle" style="color: lightgreen; font-size: 0.8em;"></i> ${data.online} Online</span>
            `;
        }

        // Update Rules (Append specific rules)
        if (subforumRulesList && data.rules.length > 0) {
            data.rules.forEach(rule => {
                const li = document.createElement('li');
                li.textContent = rule;
                subforumRulesList.appendChild(li);
            });
        }

        // Update Links (Replace default links)
        if (subforumRelatedLinks && data.links.length > 0) {
            subforumRelatedLinks.innerHTML = data.links.map(link => `
                <li><a href="${link.url}" target="_blank" rel="noopener noreferrer"><i class="${link.icon || 'fas fa-link'}"></i> ${link.text}</a></li>
            `).join('');
        } else if (subforumRelatedLinks) {
             subforumRelatedLinks.innerHTML = '<li>No specific links provided.</li>';
        }

        // Update Create Post Modal
        if (modalSubforumNameSpan) modalSubforumNameSpan.textContent = fullTitle;
        if (postSubforumHiddenInput) postSubforumHiddenInput.value = fullTitle; // Set the hidden input value

        // Update Search Scope Input
        if (searchSubforumScopeInput) searchSubforumScopeInput.value = name;

        // Load Posts (Mockup - replace with actual post loading logic)
        loadMockPosts(name, data);
    }

     // --- Mock Post Loading ---
    function loadMockPosts(subforum, data) {
        // In a real app, you'd filter posts based on the 'subforum' parameter.
        // Here, we'll just display generic placeholders or sample posts.
        // IMPORTANT: Update post title links to use post.html

        if (pinnedPostsFeed) {
            // Example: Show a generic pinned post if none defined for the topic
            if (!data.pinnedPosts || data.pinnedPosts.length === 0) {
                 pinnedPostsFeed.innerHTML = `
                 <article class="post" data-topic="campus-life" data-post-id="pinned-1">
                     <div class="post-sidebar">
                         <button class="vote-btn upvote"><i class="fas fa-arrow-up"></i></button>
                         <span class="vote-count">15</span>
                         <button class="vote-btn downvote"><i class="fas fa-arrow-down"></i></button>
                     </div>
                     <div class="post-content">
                         <div class="post-info">
                             <span class="post-flair">Announcement</span>
                             <span class="timestamp">2 days ago</span>
                             <span class="user" data-username="IES Admin">IES Admin</span>
                         </div>
                         <h3 class="post-title"><a href="post.html?id=pinned-1">Welcome to the IES Milan Forum!</a></h3>
                         <p class="post-body">This is a pinned post welcoming you to our community. Feel free to introduce yourself and ask any questions you may have about living in Milan or studying with IES.</p>
                         <div class="post-actions">
                            <button class="action-btn comment-btn"><i class="fas fa-comment-alt"></i> Comments (2)</button>
                            <button class="action-btn"><i class="fas fa-share"></i> Share</button>
                            <button class="action-btn save-btn"><i class="far fa-bookmark"></i> Save</button>
                        </div>
                     </div>
                 </article>
                 `;
            } else {
                // TO DO: render actual pinned posts
            }
        }

        if (communityPostsFeed) {
            communityPostsFeed.innerHTML = `
                <article class="post" data-topic="campus-life" data-post-id="community-1">
                    <div class="post-sidebar">
                        <button class="vote-btn upvote"><i class="fas fa-arrow-up"></i></button>
                        <span class="vote-count">5</span>
                        <button class="vote-btn downvote"><i class="fas fa-arrow-down"></i></button>
                    </div>
                    <div class="post-content">
                        <div class="post-info">
                            <span class="post-flair">Question</span>
                            <span class="timestamp">1 hour ago</span>
                            <span class="user">FlyingSquirrelMan</span>
                        </div>
                        <h3 class="post-title"><a href="post.html?id=community-1">Looking for a room in a shared apartment</a></h3>
                        <p class="post-body">Hi everyone, I'm looking for a room in a shared apartment in the city center. If anyone has any leads or knows of any available rooms, please let me know. Thanks!</p>
                        <div class="post-actions">
                            <button class="action-btn comment-btn"><i class="fas fa-comment-alt"></i> Comments (0)</button>
                            <button class="action-btn"><i class="fas fa-share"></i> Share</button>
                            <button class="action-btn save-btn"><i class="far fa-bookmark"></i> Save</button>
                        </div>
                    </div>
                </article>
            `;
        }
    }

    // --- Event Listeners ---

    // Update page content based on the subforum name
    updatePageContent(subforumName);

    // Create Post button (placeholder action)
    createPostBtnSubforum?.addEventListener('click', () => {
        createPostModalOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close Create Post Modal Listener
    closeCreatePostModalBtn?.addEventListener('click', () => {
        createPostModalOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });

    createPostModalOverlay?.addEventListener('click', (event) => {
        if (event.target === createPostModalOverlay) {
            createPostModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Optional: Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && createPostModalOverlay?.classList.contains('active')) {
            createPostModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Initialize dropdown for this page if elements exist
    userProfileToggle?.addEventListener('click', (event) => {
        event.stopPropagation();
        userDropdown?.classList.toggle('show');
        userProfileToggle.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (userDropdown?.classList.contains('show') && !userProfileToggle.contains(event.target)) {
            userDropdown.classList.remove('show');
            userProfileToggle.classList.remove('active');
        }
    });

     // --- Re-add save/vote/comment handlers for dynamically loaded posts ---
    function initializePostActions(containerElement) {
        // Vote buttons
        containerElement.querySelectorAll('.vote-btn').forEach(btn => {
            // Basic toggle logic, doesn't store state
            btn.addEventListener('click', () => {
                const isActive = btn.classList.contains('active');
                const isUpvote = btn.classList.contains('upvote');
                const sibling = isUpvote ? btn.parentElement?.querySelector('.downvote') : btn.parentElement?.querySelector('.upvote');

                if (isActive) {
                    btn.classList.remove('active');
                } else {
                    if (sibling?.classList.contains('active')) {
                        sibling.classList.remove('active');
                    }
                    btn.classList.add('active');
                }
            });
        });

        // Save buttons
        containerElement.querySelectorAll('.save-btn').forEach(btn => {
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

        // Comment buttons -> Alert for now on subforum page
        containerElement.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                const postElement = btn.closest('.post');
                const postId = postElement?.dataset.postId;
                // Redirect to post page instead of opening modal
                if (postId) {
                    window.location.href = `post.html?id=${postId}`;
                } else {
                     alert("Click the post title to view comments.");
                }
            });
        });
    }

    // Call initialization after loading mock posts
    if (pinnedPostsFeed) initializePostActions(pinnedPostsFeed);
    if (communityPostsFeed) initializePostActions(communityPostsFeed);

});