import unifiedStore from "~services/UnifiedStore";
import historyService from "~services/HistoryService";
import {encryptDataWithPublicKey} from "~utils";
import {DomainType} from "~background/context-menu";

export async function incognitoModeStartup() {
  unifiedStore.onUpdated.addListener(store => {
    Promise.all([
      chrome.action.setBadgeText({
        text: store.app.incognitoMode ? 'ON' : 'OFF',
      }),
      chrome.action.setBadgeBackgroundColor({
        color: store.app.incognitoMode ? '#000000' : '#ff4747',
      })
    ]).then(() => null);
  });

  chrome.history.onVisited.addListener(async historyItem => {
    const urlLists = unifiedStore.rawData['hmh-lists'];
    const url = new URL(historyItem.url);
    const store = unifiedStore.getStore();
    if (historyItem.url.startsWith('chrome-extension://')) return;
    if (store.app.incognitoMode) {
      if (urlLists[url.hostname] === DomainType.blacklist) return;
      // before delete, we add entry to history
      if (store.auth.publicKey) {
        await historyService.addStoredEntry({
          ...historyItem,
          title: await encryptDataWithPublicKey(store.auth.publicKey, historyItem.title),
          url: await encryptDataWithPublicKey(store.auth.publicKey, historyItem.url),
        });
      }
      await chrome.history.deleteUrl({
        url: historyItem.url,
      })
    } else {
      if (urlLists[url.hostname] === DomainType.whitelist) {
        await chrome.history.deleteUrl({
          url: historyItem.url,
        })
      }
    }
  });
}