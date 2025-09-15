// Enhanced lessons data with avatar images and current lesson tracking
const lessonsData = [
  {
    id: 1,
    title: "Introduction",
    subtitle: "Learn basic greetings and introductions",
    level: "Beginner",
    progress: 0,
    quizId: "131",
    locked: false,
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    title: "Order Favorite Coffee",
    subtitle: "Talk about yourself and ask about others",
    level: "Beginner",
    progress: 0,
    quizId: "138",
    locked: true,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    title: "Coffee Choices",
    subtitle: "Learn how to ask for assistance and clarification",
    level: "Elementary",
    progress: 0,
    quizId: "133",
    locked: true,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    title: "Smoothie Options",
    subtitle: "Essential grammar rules and structures",
    type: "ai-chat",
    level: "Elementary",
    progress: 0,
    quizId: "139",
    locked: true,
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    title: "Items to Buy",
    subtitle: "Talk about your free time activities",
    type: "pronunciation",
    level: "Intermediate",
    progress: 0,
    quizId: "141",
    locked: true,
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 6,
    title: "Shop at a Mall",
    subtitle: "Essential phrases for shopping and payments",
    type: "ai-chat",
    level: "Intermediate",
    progress: 0,
    quizId: "145",
    locked: true,
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 7,
    title: "Plan a trip",
    subtitle: "Navigate cities and ask for directions",
    type: "pronunciation",
    level: "Intermediate",
    progress: 0,
    quizId: "147",
    locked: true,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 8,
    title: "Planning a Road Trip",
    subtitle: "Talk about health issues and symptoms",
    type: "ai-chat",
    level: "Advanced",
    progress: 0,
    quizId: "149",
    locked: true,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 9,
    title: "Flight Details Inquiry",
    subtitle: "Discuss jobs and professional life",
    type: "pronunciation",
    level: "Advanced",
    progress: 0,
    quizId: "153",
    locked: true,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 10,
    title: "Future Plans and Goals",
    subtitle: "Talk about aspirations and future plans",
    type: "ai-chat",
    level: "Advanced",
    progress: 0,
    quizId: "158",
    locked: true,
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face",
  },
];

// DOM Elements
const lessonsContainer = document.getElementById("lessonsContainer");

// Path calculation variables
let currentLessons = [];
let containerWidth = 0;
let containerHeight = 0;

// Initialize the lessons path
function initLessonsMap() {
  setupEventListeners();
  loadUserProgressFromStorage();
  currentLessons = [...lessonsData];
  renderLessonsPath();

  window.addEventListener("resize", debounce(handleResize, 250));

  // Listen for page focus to check for progress updates
  window.addEventListener("focus", checkForProgressUpdates);
  document.addEventListener("visibilitychange", checkForProgressUpdates);

  // Listen for lesson completion messages from child windows
  window.addEventListener("message", handleLessonCompletionMessage);

  // Listen for localStorage changes (for same-origin communication)
  window.addEventListener("storage", handleStorageChange);
}

// Set up event listeners
function setupEventListeners() {
  // Remove search and filter event listeners as requested
}

// Check for progress updates when page becomes visible
function checkForProgressUpdates() {
  if (document.visibilityState === "visible" || document.hasFocus) {
    loadUserProgressFromStorage();
    renderLessonsPath();
  }
}

// Handle lesson completion messages from child windows
function handleLessonCompletionMessage(event) {
  // Verify the message is from our domain for security
  if (event.origin !== window.location.origin) {
    return;
  }

  if (event.data && event.data.type === "lessonCompleted") {
    const lessonNumber = event.data.lessonNumber;
    console.log(
      `Received lesson completion notification for lesson ${lessonNumber}`
    );

    // Update lessons with progress and re-render
    updateLessonsWithProgress();
    renderLessonsPath();

    // Show a completion notification (optional)
    showLessonCompletionNotification(lessonNumber);
  }
}

// Handle localStorage changes for lesson completion
function handleStorageChange(event) {
  if (event.key === "lastCompletedLesson" && event.newValue) {
    try {
      const completionData = JSON.parse(event.newValue);
      console.log(
        `Lesson ${completionData.lessonNumber} completed via localStorage event`
      );

      // Update lessons with progress and re-render
      updateLessonsWithProgress();
      renderLessonsPath();
    } catch (error) {
      console.error("Error parsing lesson completion data:", error);
    }
  }
}

// Show lesson completion notification (optional)
function showLessonCompletionNotification(lessonNumber) {
  // Find the completed lesson
  const completedLesson = lessonsData.find(
    (lesson) => lesson.id === lessonNumber
  );
  if (completedLesson) {
    console.log(
      `🎉 Lesson "${completedLesson.title}" completed! Next lesson unlocked.`
    );

    // You could add a toast notification here if desired
    // showToast(`Lesson "${completedLesson.title}" completed!`);
  }
}

// ========== TESTING UTILITIES FOR INDEX.HTML ==========
// These functions are for testing the lesson completion system

// Test function: Simulate lesson completion from index.html
function testSimulateLessonCompletion(lessonNumber) {
  console.log(
    `🧪 Testing: Simulating lesson ${lessonNumber} completion from index.html`
  );

  // Manually mark lesson as completed
  if (window.ProgressManager) {
    window.ProgressManager.completeLesson(lessonNumber);
    console.log(`  ✅ Marked lesson ${lessonNumber} as completed`);
  }

  // Update the visual progress
  updateLessonsWithProgress();
  renderLessonsPath();
  console.log(`  🎯 Updated lesson path visualization`);
}

// Test function: Check current lesson progress
function testCheckLessonProgress() {
  console.log("🧪 Testing: Current lesson progress status");

  if (!window.ProgressManager) {
    console.error("ProgressManager not available");
    return;
  }

  for (let i = 1; i <= lessonsData.length; i++) {
    const isCompleted = window.ProgressManager.isLessonCompleted(i);
    const lesson = lessonsData.find((l) => l.id === i);
    console.log(
      `  Lesson ${i} (${lesson ? lesson.title : "Unknown"}): ${
        isCompleted ? "✅ Completed" : "⏳ Not completed"
      }`
    );
  }
}

// Test function: Clear all progress from index.html
function testClearProgressFromIndex() {
  console.log("🧪 Testing: Clearing all progress from index.html");

  if (window.ProgressManager) {
    window.ProgressManager.clearProgress();
    console.log("  ✅ All progress cleared");

    // Update the visual progress
    updateLessonsWithProgress();
    renderLessonsPath();
    console.log("  🎯 Updated lesson path visualization");
  }
}

// Test function: Test message communication
function testMessageCommunication(lessonNumber) {
  console.log(`🧪 Testing: Message communication for lesson ${lessonNumber}`);

  // Simulate receiving a lesson completion message
  const testMessage = {
    origin: window.location.origin,
    data: {
      type: "lessonCompleted",
      lessonNumber: lessonNumber,
      progress: 100,
    },
  };

  handleLessonCompletionMessage(testMessage);
  console.log(
    `  ✅ Simulated lesson completion message for lesson ${lessonNumber}`
  );
}

// Test function: Manually complete lesson 1 for debugging
function testCompleteLesson1() {
  console.log("🧪 Testing: Manually completing lesson 1");

  if (typeof window.ProgressManager === "undefined") {
    console.error("ProgressManager not available");
    return;
  }

  // Complete lesson 1
  window.ProgressManager.completeLesson(1);
  console.log("✅ Marked lesson 1 as completed");

  // Update the visual progress
  updateLessonsWithProgress();
  renderLessonsPath();
  console.log("🎯 Updated lesson path visualization");

  // Check if lesson 2 is now unlocked
  const lesson2Unlocked = window.ProgressManager.isLessonUnlocked(
    2,
    lessonsData
  );
  console.log(`Lesson 2 unlocked: ${lesson2Unlocked}`);
}

// Test function: Check all lesson completion status
function testCheckAllLessons() {
  console.log("🧪 Testing: Checking all lesson completion status");

  if (typeof window.ProgressManager === "undefined") {
    console.error("ProgressManager not available");
    return;
  }

  for (let i = 1; i <= 10; i++) {
    const isCompleted = window.ProgressManager.isLessonCompleted(i);
    const isUnlocked = window.ProgressManager.isLessonUnlocked(i, lessonsData);
    const conversationIds =
      window.ProgressManager.getConversationIdsForLesson(i);

    console.log(
      `Lesson ${i}: ${isCompleted ? "✅ Completed" : "⏳ Not completed"} | ${
        isUnlocked ? "🔓 Unlocked" : "🔒 Locked"
      } | Conversations: [${conversationIds.join(", ")}]`
    );
  }
}

// Make testing functions globally available
window.testSimulateLessonCompletion = testSimulateLessonCompletion;
window.testCheckLessonProgress = testCheckLessonProgress;
window.testClearProgressFromIndex = testClearProgressFromIndex;
window.testMessageCommunication = testMessageCommunication;
window.testCompleteLesson1 = testCompleteLesson1;
window.testCheckAllLessons = testCheckAllLessons;

// Handle window resize
function handleResize() {
  renderLessonsPath();
}

// Handle level filter
function handleFilter() {
  filterAndRenderLessons(
    searchInput.value.toLowerCase().trim(),
    levelFilter.value,
    sortBy.value
  );
}

// Handle sorting
function handleSort() {
  filterAndRenderLessons(
    searchInput.value.toLowerCase().trim(),
    levelFilter.value,
    sortBy.value
  );
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Filter and render lessons based on criteria
function filterAndRenderLessons(searchTerm, level, sortValue) {
  let filteredLessons = [...lessonsData];

  // Apply search filter
  if (searchTerm) {
    filteredLessons = filteredLessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(searchTerm) ||
        lesson.subtitle.toLowerCase().includes(searchTerm)
    );
  }

  // Apply level filter
  if (level !== "all") {
    filteredLessons = filteredLessons.filter(
      (lesson) => lesson.level === level
    );
  }

  // Apply sorting
  switch (sortValue) {
    case "level":
      const levelOrder = {
        Beginner: 0,
        Elementary: 1,
        Intermediate: 2,
        Advanced: 3,
      };
      filteredLessons.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
      break;
    case "title":
      filteredLessons.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      // Default order (by ID)
      filteredLessons.sort((a, b) => a.id - b.id);
  }

  currentLessons = filteredLessons;
  renderLessonsPath();
}

// Calculate organic path positions with mobile alternating layout
function calculatePathPositions(lessons) {
  const positions = [];

  containerWidth = lessonsContainer.offsetWidth || window.innerWidth;
  containerHeight = Math.max(800, lessons.length * 220); // Increased spacing

  // Ensure minimum dimensions
  if (containerWidth < 300) containerWidth = 300;
  if (containerHeight < 800) containerHeight = 800;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  let padding, availableWidth, availableHeight;

  if (isMobile) {
    padding = 120;
    availableWidth = containerWidth - padding * 2;
    availableHeight = containerHeight - padding * 2;
  } else {
    padding = 150;
    availableWidth = containerWidth - padding * 2;
    availableHeight = containerHeight - padding * 2;
  }

  lessons.forEach((lesson, index) => {
    if (isMobile) {
      // Mobile alternating layout
      const y =
        padding + (index / Math.max(lessons.length - 1, 1)) * availableHeight;
      const centerX = containerWidth / 2;

      const lessonInfoWidth = 180;
      const circleRadius = 35;
      const safeMargin = 20;

      const maxSafeOffset = Math.min(
        containerWidth / 2 - lessonInfoWidth - circleRadius - safeMargin,
        containerWidth * 0.2
      );

      const offsetDistance = Math.max(maxSafeOffset, 40);

      let x, side;
      if (index % 2 === 0) {
        x = centerX - offsetDistance;
        side = "left";
      } else {
        x = centerX + offsetDistance;
        side = "right";
      }

      x = Math.max(
        circleRadius + safeMargin,
        Math.min(containerWidth - circleRadius - safeMargin, x)
      );

      positions.push({ x, y, side });
    } else {
      // Desktop layout
      const progress = index / Math.max(lessons.length - 1, 1);
      const baseY = padding + progress * availableHeight;

      const centerX = containerWidth / 2;
      const maxOffset = availableWidth * 0.3;

      let xOffset;
      const cycle = index % 6;

      switch (cycle) {
        case 0:
          xOffset = -maxOffset * 0.8;
          break;
        case 1:
          xOffset = maxOffset * 0.9;
          break;
        case 2:
          xOffset = -maxOffset * 0.6;
          break;
        case 3:
          xOffset = maxOffset * 0.7;
          break;
        case 4:
          xOffset = -maxOffset * 0.4;
          break;
        case 5:
          xOffset = maxOffset * 0.5;
          break;
        default:
          xOffset = 0;
      }

      const x = centerX + xOffset;
      const y = baseY;

      const finalX = Math.max(padding, Math.min(containerWidth - padding, x));
      const finalY = Math.max(padding, Math.min(containerHeight - padding, y));

      positions.push({
        x: finalX,
        y: finalY,
        side: finalX < containerWidth / 2 ? "left" : "right",
      });
    }
  });

  return positions;
}

// Render lessons path
function renderLessonsPath() {
  if (currentLessons.length === 0) {
    renderNoResults();
    return;
  }

  const positions = calculatePathPositions(currentLessons);

  lessonsContainer.style.height = `${containerHeight}px`;
  lessonsContainer.style.position = "relative";
  lessonsContainer.innerHTML = "";

  const svg = createSVGElement(containerWidth, containerHeight);
  lessonsContainer.appendChild(svg);

  currentLessons.forEach((lesson, index) => {
    const position = positions[index];
    const lessonNode = createLessonNode(lesson, position, index);
    lessonsContainer.appendChild(lessonNode);

    if (index < currentLessons.length - 1) {
      const nextPosition = positions[index + 1];
      const path = createLessonPath(position, nextPosition, lesson, index);
      svg.appendChild(path);
    }
  });
}

// Create SVG element
function createSVGElement(width, height) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("lessons-path-svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  return svg;
}

// Create curved path between lesson circles with mobile alternating curves
function createLessonPath(startPos, endPos, lesson, index) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  // Get actual circle radius based on screen size
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const isSmallMobile = window.matchMedia("(max-width: 480px)").matches;

  let circleRadius;
  if (isSmallMobile) {
    circleRadius = 30; // 60px circle / 2
  } else if (isMobile) {
    circleRadius = 35; // 70px circle / 2
  } else {
    circleRadius = 40; // 80px circle / 2
  }

  // Calculate exact connection points - bottom of start circle to top of end circle
  const startX = startPos.x;
  const startY = startPos.y + circleRadius; // Bottom edge of start circle
  const endX = endPos.x;
  const endY = endPos.y - circleRadius; // Top edge of end circle

  let pathData;

  if (isMobile) {
    pathData = createMobileAlternatingPath(startX, startY, endX, endY, index);
  } else {
    // Desktop path logic
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const midY = startY + deltaY * 0.5;
    const controlOffset = Math.min(Math.abs(deltaX) * 2, 600);

    if (Math.abs(deltaX) > 50) {
      const control1X = startX + (deltaX > 0 ? controlOffset : -controlOffset);
      const control1Y = startY + deltaY * 0.25;
      const control2X = endX - (deltaX > 0 ? controlOffset : -controlOffset);
      const control2Y = endY - deltaY * 0.25;

      pathData = `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;
    } else {
      const controlX = startX + deltaX * 0.5;
      const controlY = midY - Math.abs(deltaX) * 0.3;
      pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
    }
  }

  path.setAttribute("d", pathData);
  path.classList.add("lesson-path");

  // Update path styling based on lesson completion status
  // The path should be completed if the current lesson (start lesson) is completed
  if (lesson.progress >= 100) {
    path.classList.add("completed");
    path.classList.remove("incomplete");
  } else {
    path.classList.add("incomplete");
    path.classList.remove("completed");
  }

  return path;
}

// Create mobile alternating curved path with safe boundaries
function createMobileAlternatingPath(startX, startY, endX, endY, index) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // Calculate safe curve amplitude
  const screenWidth = window.innerWidth;
  const safeMargin = 40;

  const maxLeftExtension = startX - safeMargin;
  const maxRightExtension = screenWidth - startX - safeMargin;
  const maxCurveSpace = Math.min(maxLeftExtension, maxRightExtension);

  let curveAmplitude;

  if (screenWidth <= 480) {
    curveAmplitude = Math.min(screenWidth * 0.25, maxCurveSpace);
  } else if (screenWidth <= 768) {
    curveAmplitude = Math.min(screenWidth * 0.2, maxCurveSpace);
  } else {
    curveAmplitude = Math.min(150, maxCurveSpace);
  }

  curveAmplitude = Math.max(curveAmplitude, 30);

  const curveDirection = deltaX > 0 ? 1 : -1;
  const controlOffset = curveAmplitude * curveDirection;

  // Control points for smooth S-curve
  let control1X = startX + controlOffset;
  const control1Y = startY + deltaY * 0.4; // More pronounced curve

  let control2X = endX - controlOffset;
  const control2Y = endY - deltaY * 0.4;

  // Clamp control points to safe boundaries
  control1X = Math.max(
    safeMargin,
    Math.min(screenWidth - safeMargin, control1X)
  );
  control2X = Math.max(
    safeMargin,
    Math.min(screenWidth - safeMargin, control2X)
  );

  return `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;
}

// Create lesson node
function createLessonNode(lesson, position, index) {
  const node = document.createElement("div");
  node.classList.add("lesson-node", position.side);
  node.style.left = `${position.x}px`;
  node.style.top = `${position.y}px`;
  node.dataset.lessonId = lesson.id;

  // Create lesson circle
  const circle = createLessonCircle(lesson);

  // Create lesson info
  const info = createLessonInfo(lesson);

  node.appendChild(circle);
  node.appendChild(info);

  return node;
}

// Create lesson circle with avatar
function createLessonCircle(lesson) {
  const circle = document.createElement("div");
  circle.classList.add("lesson-circle");

  // Determine circle state based on progress and locked status
  if (lesson.progress >= 100) {
    circle.classList.add("completed");
  } else if (lesson.progress > 0) {
    circle.classList.add("in-progress");
  } else if (lesson.locked) {
    circle.classList.add("locked");
  } else {
    circle.classList.add("current");
  }

  // Add avatar or icon
  if (lesson.avatar) {
    const avatar = document.createElement("div");
    avatar.classList.add("lesson-avatar");
    avatar.style.backgroundImage = `url(${lesson.avatar})`;
    circle.appendChild(avatar);
  } else {
    const icon = document.createElement("i");
    icon.classList.add("lesson-icon", getLessonIcon(lesson.id));
    circle.appendChild(icon);
  }

  // Add checkmark for completed lessons
  if (lesson.progress >= 100) {
    const checkmark = document.createElement("div");
    checkmark.classList.add("lesson-checkmark");
    checkmark.innerHTML = '<i class="fas fa-check"></i>';
    circle.appendChild(checkmark);
  }

  return circle;
}

// Create lesson info panel - simplified without card styling
function createLessonInfo(lesson) {
  const info = document.createElement("div");
  info.classList.add("lesson-info");

  if (lesson.locked) {
    info.classList.add("locked");
  }

  // Add click handler for lesson title and arrow
  info.addEventListener("click", () => {
    if (!lesson.locked) {
      window.location.href = `topics.html?lesson=${lesson.id}`;
    }
  });

  info.innerHTML = `
            <div class="lesson-content">
                <h3 class="lesson-title">Lesson ${lesson.id}</h3>
                <p class="lesson-subtitle">${lesson.title}</p>
            </div>
            <i class="fas fa-chevron-right lesson-arrow"></i>
        `;

  return info;
}

// Get appropriate icon for each lesson
function getLessonIcon(lessonId) {
  switch (lessonId) {
    case 1:
      return "fas fa-handshake";
    case 2:
      return "fas fa-coffee";
    case 3:
      return "fas fa-mug-hot";
    case 4:
      return "fas fa-blender";
    case 5:
      return "fas fa-shopping-bag";
    case 6:
      return "fas fa-store";
    case 7:
      return "fas fa-map-marked-alt";
    case 8:
      return "fas fa-route";
    case 9:
      return "fas fa-plane";
    case 10:
      return "fas fa-bullseye";
    default:
      return "fas fa-book-open";
  }
}

// Render no results message
function renderNoResults() {
  lessonsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No lessons found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
}

// Load user progress from localStorage using ProgressManager
function loadUserProgressFromStorage() {
  // Check if ProgressManager is available
  if (typeof window.ProgressManager === "undefined") {
    loadProgressManagerScript().then(() => {
      updateLessonsWithProgress();
    });
  } else {
    updateLessonsWithProgress();
  }
}

// Load the progress manager script dynamically if not loaded
function loadProgressManagerScript() {
  return new Promise((resolve, reject) => {
    if (typeof window.ProgressManager !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "progress-manager.js";
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      console.error("Failed to load Progress Manager");
      reject();
    };
    document.head.appendChild(script);
  });
}

// Update lessons data with progress information
function updateLessonsWithProgress() {
  if (typeof window.ProgressManager === "undefined") {
    console.error("ProgressManager not available");
    return;
  }

  const progressManager = window.ProgressManager;
  const updatedLessons = progressManager.updateLessonsWithProgress(lessonsData);

  // Update the original lessonsData array
  updatedLessons.forEach((updatedLesson, index) => {
    if (lessonsData[index]) {
      lessonsData[index].progress = updatedLesson.progress;
      lessonsData[index].locked = updatedLesson.locked;
    }
  });

  // Show progress statistics in console
  const stats = progressManager.getProgressStats(lessonsData);
  console.log(
    `Progress Stats: ${stats.completed}/${stats.total} lessons completed (${stats.percentage}%)`
  );
}

// Save user progress to localStorage (kept for backwards compatibility)
function saveUserProgress(lessonId, progress) {
  if (typeof window.ProgressManager !== "undefined") {
    if (progress >= 100) {
      window.ProgressManager.completeLesson(lessonId);
    }
  }

  // Update lesson data and re-render
  const lesson = lessonsData.find((l) => l.id === lessonId);
  if (lesson) {
    lesson.progress = progress;
    // Use ProgressManager to update all lessons with proper unlocking logic
    updateLessonsWithProgress();
    renderLessonsPath();
  }
}

// Update lesson lock status based on progress
function updateLessonLockStatus() {
  for (let i = 0; i < lessonsData.length; i++) {
    const lesson = lessonsData[i];
    const prevLesson = i > 0 ? lessonsData[i - 1] : null;

    // First lesson is always unlocked
    if (i === 0) {
      lesson.locked = false;
    } else if (prevLesson && prevLesson.progress >= 100) {
      // Unlock if previous lesson is completed
      lesson.locked = false;
    } else {
      // Keep locked if previous lesson is not completed
      lesson.locked = true;
    }
  }
}

// Initialize current lessons array
currentLessons = [...lessonsData];

// Initialize the lessons map when the page loads
document.addEventListener("DOMContentLoaded", initLessonsMap);

// Export functions for potential use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initLessonsMap,
    saveUserProgress,
    lessonsData,
  };
}
