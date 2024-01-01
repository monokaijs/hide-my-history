import {AppSliceState, setAppState} from "@/redux/slices/app.slice";

// used to sync data with pages
const store: {
  app: Partial<AppSliceState>,
} = {
  app: {},
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
      text: store.app.incognitoMode ? 'ON': 'OFF',
    }),
    chrome.action.setBadgeBackgroundColor({
      color: store.app.incognitoMode ? '#000000': '#ff4747',
    })
  ]).then(() => null);
}

const startup = async () => {
  for (let key of Object.keys(store)) {
    const persistedData = await chrome.storage.local.get(['persist:' + key]);
    const sliceData = JSON.parse(persistedData['persist:' + key]);
    updateStoreData(key, sliceData);
  }

  chrome.storage.local.onChanged.addListener(changes => {
    for (let key of Object.keys(store)) {
      // App settings updated
      const sliceData = JSON.parse(changes['persist:' + key].newValue);
      updateStoreData(key, sliceData);
    }
  });

  chrome.history.onVisited.addListener(result => {
    console.log(result);
  })

  // chrome.webNavigation.onBeforeNavigate.addListener(details => {
  //   console.log('event', details);
  //   if (details.url && details.timeStamp && store.app.incognitoMode && details.frameType === 'outermost_frame') {
  //     console.log('clean', details.url);
  //     chrome.history.deleteUrl({
  //       url: details.url
  //     });
  //   }
  // }, {url: [{urlMatches: 'http://*/*'}, {urlMatches: 'https://*/*'}]});
}
startup().then(() => {
  console.log('Background startup successfully.');
  console.log(store);
});
