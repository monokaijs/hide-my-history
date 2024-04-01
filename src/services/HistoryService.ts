export interface HistoryStoredItem {
  url: string;
  title: string;
  time: number;
}

class HistoryService {
  maxLength: number = 100;
  items: HistoryStoredItem[] = [];
  constructor() {
  }

  async register() {
    this.items = await this.getStoredEntry();
  }

  async getStoredEntry(): Promise<HistoryStoredItem[]> {
    const response = await chrome.storage.local.get(['historyItems']);
    return response['historyItems'] || [];
  }

  async addStoredEntry(historyItem: chrome.history.HistoryItem): Promise<HistoryStoredItem[]> {
    const items = this.items;
    items.unshift({
      url: historyItem.url,
      time: historyItem.lastVisitTime,
      title: historyItem.title,
    });
    if (items.length > this.maxLength) items.length = this.maxLength;
    this.items = items;
    chrome.storage.local.set({
      historyItems: items,
    }).then(() => null);
    return items;
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
