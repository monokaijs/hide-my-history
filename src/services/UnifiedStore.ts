import {AppSliceState} from "~redux/slices/app.slice";
import {AuthSliceState} from "~redux/slices/auth.slice";

interface StoreType {
  app: Partial<AppSliceState>,
  auth: Partial<AuthSliceState>,
}

type onUpdatedFn = (store: StoreType, rawData: any) => any | Promise<any>;

class UnifiedStore {
  rawData: any = {}
  store: StoreType = {
    app: {},
    auth: {},
  };

  onUpdated: {
    listeners: onUpdatedFn[],
    addListener(fn: onUpdatedFn): any,
  } = {
    listeners: [],
    addListener(fn) {
      return this.listeners.push(fn);
    }
  }

  setSlice(key: keyof StoreType, data: StoreType[keyof StoreType]) {
    this.store[key] = {
      ...this.store[key],
      ...data,
    };
    chrome.storage.local.set({
      [`persist:${key}`]: JSON.stringify(this.store[key]),
    }).then(() => this.notifyChanges());
  }

  getStore() {
    return this.store;
  }

  async register() {
    this.rawData = await new Promise(response => {
      chrome.storage.local.get(null, (data) => response(data));
    });
    // read all data
    for (let key of Object.keys(this.store)) {
      const persistedData = this.rawData['persist:' + key];
      const sliceData = JSON.parse(persistedData['persist:' + key] || '{}');
      this.acknowledgeUpdate(key, sliceData);
    }
    chrome.storage.local.onChanged.addListener(changes => {
      for (let key of Object.keys(changes)) {
        this.rawData[key] = changes[key].newValue;
      }
      for (let key of Object.keys(this.store)) {
        if (!changes['persist:' + key]) continue;
        // App settings updated
        const sliceData = JSON.parse(changes['persist:' + key].newValue);
        this.acknowledgeUpdate(key, sliceData);
      }
      this.notifyChanges();
    });
    this.notifyChanges();
    return this.store;
  }

  acknowledgeUpdate(key: string, sliceData: any) {
    const parsedData = {};
    for (let sliceKey of Object.keys(sliceData)) {
      try {
        parsedData[sliceKey] = JSON.parse(sliceData[sliceKey]);
      } catch (e) {
        parsedData[sliceKey] = sliceData[sliceKey];
      }
    }
    this.store[key] = parsedData;
    return parsedData;
  }

  notifyChanges() {
    for (let fn of this.onUpdated.listeners) {
      fn(this.store, this.rawData);
    }
  }
}

export default new UnifiedStore();