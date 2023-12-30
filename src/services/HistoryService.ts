class HistoryService {
  constructor() {
  }

  // Query browsing history based on time range
  async queryHistory(startTime: number, endTime: number): Promise<chrome.history.HistoryItem[]> {
    return new Promise((resolve, reject) => {
      chrome.history.search({
        text: '', // Empty string to match all history items
        startTime: startTime,
        endTime: endTime,
        maxResults: 100, // Maximum number of results to retrieve
      }, (results) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Clear browsing history within a specified time range
  async clearHistory(startTime: number, endTime: number): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.history.deleteRange({
        startTime: startTime,
        endTime: endTime,
      }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }
}

// Create an instance of the HistoryService
const historyService = new HistoryService();

export default historyService;
