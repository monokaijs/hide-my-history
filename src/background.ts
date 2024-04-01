import {AppSliceState, setAppState} from "@/redux/slices/app.slice";
import {AuthSliceState} from "~redux/slices/auth.slice";
import historyService from "~services/HistoryService";
import {encryptDataWithPublicKey} from "~utils/encryption.utils";

// used to sync data with pages
const store: {
  app: Partial<AppSliceState>,
  auth: Partial<AuthSliceState>,
} = {
  app: {},
  auth: {},
}

const updateStoreData = (key: string, sliceData: any) => {
  const parsedData = {};
  for (let sliceKey of Object.keys(sliceData)) {
    parsedData[sliceKey] = JSON.parse(sliceData[sliceKey]);
  }
  store[key] = parsedData;

  // on update
  Promise.all([
    chrome.action.setBadgeText({
      text: store.app.incognitoMode ? 'ON' : 'OFF',
    }),
    chrome.action.setBadgeBackgroundColor({
      color: store.app.incognitoMode ? '#000000' : '#ff4747',
    })
  ]).then(() => null);
}

const startup = async () => {
  await historyService.register();
  for (let key of Object.keys(store)) {
    const persistedData = await chrome.storage.local.get(['persist:' + key]);
    const sliceData = JSON.parse(persistedData['persist:' + key] || '{}');
    updateStoreData(key, sliceData);
  }

  chrome.storage.local.onChanged.addListener(changes => {
    for (let key of Object.keys(store)) {
      if (!changes['persist:' + key]) return;
      // App settings updated
      const sliceData = JSON.parse(changes['persist:' + key].newValue);
      updateStoreData(key, sliceData);
    }
  });
  chrome.history.onVisited.addListener(async historyItem => {
    if (historyItem.url.startsWith('chrome-extension://')) return;
    if (store.app.incognitoMode) {
      const whitelistedUrls = store.app.whitelisted;
      const removeTrailingSlash = (url: string) => url.endsWith('/') ? url.slice(0, -1) : url;
      for (let rule of whitelistedUrls) {
        if (rule.type === 'url') {
          if (removeTrailingSlash(rule.url) === removeTrailingSlash(historyItem.url)) return;
        } else if (rule.type === 'domain') {
          const itemUrl = new URL(historyItem.url);
          if (itemUrl.host === rule.url) return;
        } else if (rule.type === 'pattern') {
          if (historyItem.url.match(new RegExp(rule.url))) return;
        } else {
          // Invalid rule
        }
      }
      // before delete, we add entry to history
      if (store.auth.publicKey) {
        try {
          await historyService.addStoredEntry({
            ...historyItem,
            title: await encryptDataWithPublicKey(store.auth.publicKey, historyItem.title),
            url: await encryptDataWithPublicKey(store.auth.publicKey, historyItem.url),
          });
        } catch (e) {
          console.log('Error adding entry', e);
        }
      }
      await chrome.history.deleteUrl({
        url: historyItem.url,
      })
    }
  });
}

startup().then(() => {
  console.log('Background startup successfully.');
  console.log(store);
});