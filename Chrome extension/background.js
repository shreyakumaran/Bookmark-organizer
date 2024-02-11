
const { downloads } = chrome;
// Define the categorizeBookmarks function
function categorizeBookmarks(bookmarkTreeNodes) {
  // Function implementation
}

// Call the categorizeBookmarks function
chrome.runtime.onInstalled.addListener(function() {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    const categorizedBookmarks = categorizeBookmarks(bookmarkTreeNodes);
    // Save the categorized bookmarks to the extension's storage
    chrome.storage.sync.set({ categorizedBookmarks: categorizedBookmarks });
  });
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    // Extract and categorize the bookmarks
    var categorizedBookmarks = categorizeBookmarks(bookmarkTreeNodes);
    // Store the categorized bookmarks in the extension's storage
    chrome.storage.sync.set({ categorizedBookmarks: categorizedBookmarks }, function() {
      // Update the Excel sheet with the categorized bookmarks
      updateExcelSheet(categorizedBookmarks);
    });
  });

  // Assume you have a function to categorize the new bookmark and update the categorized bookmarks
  function categorizeNewBookmark(newBookmark) {
    function categorizeBookmarks(bookmarkTreeNodes) {
      var categorizedBookmarks = {
        productivity: [],
        coding: [],
        entertainment: [],
        interview: [],
        miscellaneous: []
      };

      function categorizeBookmarkByKeyword(url, title) {
        const keywords = {
          productivity: ['todo', 'productivity', 'organization', 'organize'],
          coding: ['github', 'stackoverflow', 'programming',],
          entertainment: ['youtube', 'netflix', 'fun'],
          interview: ['interview', 'job', 'career'],
        };

        let categorized = false;

        Object.keys(keywords).forEach(category => {
          keywords[category].forEach(keyword => {
            if (url.includes(keyword) || title.includes(keyword)) {
              categorizedBookmarks[category].push({ title: title, url: url });
              categorized = true;
            }
          });
        });
        var updatedCategorizedBookmarks = categorizeBookmarks([newBookmark]);
        // Update the Excel sheet with the updated categorized bookmarks
        updateExcelSheet(updatedCategorizedBookmarks);

        if (!categorized) {
          categorizedBookmarks.miscellaneous.push({ title: title, url: url });
        }
      }

      function traverseBookmarks(node) {
        if (node.children) {
          node.children.forEach(child => traverseBookmarks(child));
        } else {
          if (node.url) {
            categorizeBookmarkByKeyword(node.url, node.title);
          }
        }
      }

      bookmarkTreeNodes.forEach(node => traverseBookmarks(node));

      return categorizedBookmarks;
    }
    return categorizedBookmarks; // Return the updated categorized bookmarks
  }

  // Assume you have an event listener for when a new bookmark is saved
  chrome.bookmarks.onCreated.addListener(function(newBookmark) {
    // Categorize the new bookmark and get the updated categorized bookmarks
    var updatedCategorizedBookmarks = categorizeNewBookmark(newBookmark);

    // Update the Excel sheet with the updated categorized bookmarks
    updateExcelSheet(updatedCategorizedBookmarks);
  });
});

// Function to update the Excel sheet with the categorized bookmarks
function updateExcelSheet(categorizedBookmarks) {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create a new worksheet
  const worksheet = XLSX.utils.json_to_sheet(categorizedBookmarks);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Categorized Bookmarks');

  // Save the workbook as an Excel file
  const data = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(data);

  // Download the Excel file
  downloads.download({ url: url, filename: 'categorized_bookmarks.xlsx', saveAs: true });
}