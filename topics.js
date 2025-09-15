// Topics Page JavaScript
let currentLesson = null;
let topicsData = [];

// DOM Elements
const topicsContainer = document.getElementById("topicsContainer");
const lessonHeader = document.getElementById("lessonHeader");
const lessonTitle = document.getElementById("lessonTitle");
const lessonSubtitle = document.getElementById("lessonSubtitle");
const lessonProgress = document.getElementById("lessonProgress");
const backButton = document.getElementById("backButton");

// Initialize the topics page
async function initTopicsPage() {
  console.log("Initializing topics page...");

  // Get lesson number from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const lessonNumber = parseInt(urlParams.get("lesson")) || 1;

  console.log("Lesson number:", lessonNumber);

  // Set up event listeners
  setupEventListeners();

  // Load lesson data and wait for it to complete
  await loadLessonData(lessonNumber);

  // Render topics after data is loaded
  renderTopics();
}

// Load lesson data from data.json
async function loadLessonData(lessonNumber) {
  try {
    console.log("Loading lesson data for lesson:", lessonNumber);
    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data loaded:", data);

    if (!data.lessons || !Array.isArray(data.lessons)) {
      throw new Error("Invalid data structure: lessons array not found");
    }

    currentLesson = data.lessons.find(
      (lesson) => lesson.lessonNumber === lessonNumber
    );

    console.log("Current lesson:", currentLesson);

    if (!currentLesson) {
      console.error("Lesson not found:", lessonNumber);
      topicsContainer.innerHTML =
        '<div class="no-topics">Lesson not found</div>';
      return;
    }

    topicsData = currentLesson.topics || [];
    console.log("Topics data:", topicsData);

    // Update lesson header
    updateLessonHeader();
  } catch (error) {
    console.error("Error loading lesson data:", error);
    topicsContainer.innerHTML =
      '<div class="no-topics">Error loading data: ' + error.message + "</div>";
  }
}

// Update lesson header
function updateLessonHeader() {
  if (!currentLesson) return;

  lessonTitle.textContent = `Lesson ${currentLesson.lessonNumber}`;
  lessonSubtitle.textContent = currentLesson.title;

  // Calculate lesson progress
  const progress = calculateLessonProgress();
  lessonProgress.textContent = `${progress}% Complete`;
}

// Calculate lesson progress
function calculateLessonProgress() {
  if (!topicsData.length) return 0;

  let totalConversations = 0;
  let completedConversations = 0;

  topicsData.forEach((topic) => {
    topic.conversations.forEach((conversation) => {
      totalConversations++;
      if (isConversationCompleted(conversation.id)) {
        completedConversations++;
      }
    });
  });

  return totalConversations > 0
    ? Math.round((completedConversations / totalConversations) * 100)
    : 0;
}

// Check if conversation is completed
function isConversationCompleted(conversationId) {
  if (typeof window.ProgressManager !== "undefined") {
    return window.ProgressManager.isConversationCompleted(conversationId);
  }
  return false;
}

// Set up event listeners
function setupEventListeners() {
  // Desktop back button (in header)
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // Integrated lesson header back button (works for both mobile and desktop)
  const lessonBackButton = document.getElementById("lessonBackButton");
  if (lessonBackButton) {
    lessonBackButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // Mobile back button (now hidden, kept for fallback)
  const mobileBackButton = document.getElementById("mobileBackButton");
  if (mobileBackButton) {
    mobileBackButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

// Render topics
function renderTopics() {
  console.log("Rendering topics...");
  console.log("Topics data length:", topicsData.length);

  // Hide loading indicator
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.style.display = "none";
  }

  if (!topicsData.length) {
    console.log("No topics available");
    topicsContainer.innerHTML =
      '<div class="no-topics">No topics available</div>';
    return;
  }

  topicsContainer.innerHTML = "";

  topicsData.forEach((topic, index) => {
    console.log("Creating topic card for:", topic.title);
    const topicCard = createTopicCard(topic, index);
    topicsContainer.appendChild(topicCard);
  });
}

// Create topic card
function createTopicCard(topic, index) {
  const card = document.createElement("div");
  card.classList.add("topic-card");
  card.dataset.topicId = topic.id;

  // Check if topic is locked
  const isLocked = isTopicLocked(topic, index);
  const isCompleted = isTopicCompleted(topic);
  const progress = calculateTopicProgress(topic);

  if (isLocked) {
    card.classList.add("locked");
  } else if (isCompleted) {
    card.classList.add("completed");
  } else {
    card.classList.add("available");
  }

  card.innerHTML = `
        <div class="topic-header">
            <div class="topic-icon">
                <i class="${topic.icon}"></i>
            </div>
            <div class="topic-info">
                <h3 class="topic-title">${topic.title}</h3>
                <p class="topic-description">${topic.description}</p>
            </div>
            <div class="topic-actions">
                ${
                  isLocked
                    ? '<i class="fas fa-lock lock-icon"></i>'
                    : '<i class="fas fa-chevron-right arrow-icon"></i>'
                }
            </div>
        </div>
        
        ${
          !isLocked
            ? `
            <div class="topic-content">
                <div class="conversations-header">
                    <span class="conversations-count">Conversations (${
                      topic.conversations.length
                    })</span>
                </div>
                
                <div class="conversations-list">
                    ${topic.conversations
                      .map(
                        (conversation) => `
                        <div class="conversation-item" data-conversation-id="${
                          conversation.id
                        }">
                            <div class="conversation-icon">
                                <i class="fas fa-comment-dots"></i>
                            </div>
                            <div class="conversation-info">
                                <h4 class="conversation-title">${
                                  conversation.title
                                }</h4>
                                <p class="conversation-description">${
                                  conversation.description
                                }</p>
                            </div>
                            <div class="conversation-status">
                                ${
                                  isConversationCompleted(conversation.id)
                                    ? '<i class="fas fa-check-circle completed-icon"></i>'
                                    : '<i class="fas fa-play-circle play-icon"></i>'
                                }
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                
                <div class="topic-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${progress}% Complete</span>
                </div>
            </div>
        `
            : ""
        }
    `;

  // Add click handlers
  if (!isLocked) {
    // Topic header click handler for toggle
    const topicHeader = card.querySelector(".topic-header");
    const topicContent = card.querySelector(".topic-content");
    const arrowIcon = card.querySelector(".arrow-icon");

    topicHeader.addEventListener("click", (e) => {
      e.stopPropagation();

      // Toggle content visibility
      if (topicContent.classList.contains("expanded")) {
        topicContent.classList.remove("expanded");
        arrowIcon.classList.remove("fa-chevron-down");
        arrowIcon.classList.add("fa-chevron-right");
      } else {
        topicContent.classList.add("expanded");
        arrowIcon.classList.remove("fa-chevron-right");
        arrowIcon.classList.add("fa-chevron-down");
      }
    });

    // Conversation click handlers
    const conversationItems = card.querySelectorAll(".conversation-item");
    conversationItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const conversationId = parseInt(item.dataset.conversationId);
        openConversation(conversationId);
      });
    });
  }

  return card;
}

// Check if topic is locked
function isTopicLocked(topic, index) {
  // First topic is always unlocked
  if (index === 0) return false;

  // Check if previous topic is completed
  const previousTopic = topicsData[index - 1];
  return !isTopicCompleted(previousTopic);
}

// Check if topic is completed
function isTopicCompleted(topic) {
  return topic.conversations.every((conversation) =>
    isConversationCompleted(conversation.id)
  );
}

// Calculate topic progress
function calculateTopicProgress(topic) {
  if (!topic.conversations.length) return 0;

  const completedCount = topic.conversations.filter((conversation) =>
    isConversationCompleted(conversation.id)
  ).length;

  return Math.round((completedCount / topic.conversations.length) * 100);
}

// Open conversation
function openConversation(conversationId) {
  // Find the conversation data
  let conversationData = null;
  for (const topic of topicsData) {
    const conversation = topic.conversations.find(
      (c) => c.id === conversationId
    );
    if (conversation) {
      conversationData = conversation;
      break;
    }
  }

  if (!conversationData) {
    console.error("Conversation not found:", conversationId);
    return;
  }

  // Navigate to pronunciation tool with conversation data
  const params = new URLSearchParams();
  params.set("conversation", conversationId);
  params.set("lesson", currentLesson.lessonNumber);

  window.location.href = `index2.html?${params.toString()}`;
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", initTopicsPage);
