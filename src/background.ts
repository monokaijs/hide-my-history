import {AppSliceState, setAppState} from "@/redux/slices/app.slice";

// used to sync data with pages
const store: {
  app: Partial<AppSliceState>,
} = {
  app: {},
}
const startup = async () => {
  for (let key of Object.keys(store)) {
    const persistedData = await chrome.storage.local.get(['persist:' + key]);
    const sliceData = JSON.parse(persistedData['persist:' + key]);
    const parsedData = {};
    for (let sliceKey of Object.keys(sliceData)) {
      parsedData[sliceKey] = JSON.parse(sliceData[sliceKey]);
    }
    store[key] = parsedData;
  }

  chrome.storage.local.onChanged.addListener(changes => {
    if (changes['persist:app']) {
      // App settings updated
      const sliceData = JSON.parse(changes['persist:app'].newValue);
      const parsedData = {};
      for (let sliceKey of Object.keys(sliceData)) {
        parsedData[sliceKey] = JSON.parse(sliceData[sliceKey]);
      }
      store.app = parsedData;
    }
  })

  chrome.webNavigation.onCompleted.addListener(details => {
    if (details.url && details.timeStamp && store.app.incognitoMode) {
      const startTime = store.app.incognitoTime;
      const endTime = details.timeStamp + 1000;

      chrome.history.deleteRange({startTime, endTime}, () => {
        // do nothing here ;)
      });
    }
  }, {url: [{urlMatches: 'http://*/*'}, {urlMatches: 'https://*/*'}]});
}
startup().then(() => {
  console.log('Background startup successfully.');
  console.log(store);
});
