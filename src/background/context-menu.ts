import unifiedStore from "~services/UnifiedStore";
import {urlToChromeMatchPattern} from "~utils";

export async function backgroundContextMenuStartup() {
  unifiedStore.onUpdated.addListener((store) => {
    chrome.contextMenus.update('hmh-ctx-incognito', {
      checked: store.app.incognitoMode
    });
  });


  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const id = info.menuItemId.toString();
    const appSlice = unifiedStore.getStore().app;

    if (id === 'hmh-ctx-incognito') {
      appSlice.incognitoMode = info.checked;
    }

    if (tab?.url) {
      const url = new URL(tab.url);
      const domain = url.hostname;

      if (info.menuItemId === 'blacklist') {
        updateExceptionList(domain, (info.wasChecked && !info.checked) ? DomainType.undecided : DomainType.blacklist);
      } else if (info.menuItemId === 'whitelist') {
        updateExceptionList(domain, (info.wasChecked && !info.checked) ? DomainType.undecided : DomainType.whitelist);
      }
    }
    unifiedStore.setSlice('app', appSlice);
  });


  chrome.tabs.onActivated.addListener(refreshContextMenu);
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      refreshContextMenu();
    }
  });
}

type ListType = 'blacklist' | 'whitelist';

// Initialize context menu items
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Incognito mode',
    type: 'checkbox',
    id: 'hmh-ctx-incognito',
    contexts: ['all']
  });
  chrome.contextMenus.create({
    type: 'separator',
    id: 'hmh-ctx-sep-1'
  });
  chrome.contextMenus.create({
    id: 'blacklist',
    title: 'Blacklist domain',
    contexts: ['all'],
    type: 'checkbox'
  });

  chrome.contextMenus.create({
    id: 'whitelist',
    title: 'Whitelist domain',
    contexts: ['all'],
    type: 'checkbox'
  });
});

export async function updateExceptionList(domain: string, type: DomainType) {
  const data = await chrome.storage.local.get(['hmh-lists']);
  const lists: {
    [domain: string]: DomainType,
  } = data['hmh-lists'] || {};
  lists[domain] = type;
  await chrome.storage.local.set({
    ['hmh-lists']: lists,
  });
  refreshContextMenu();
}

export enum DomainType {
  undecided = 0,
  blacklist = 1,
  whitelist = 2,
}

// Refresh context menu based on current domain
function refreshContextMenu() {
  chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    if (tabs[0]?.url) {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;

      const data = await chrome.storage.local.get(['hmh-lists']);
      const lists: {
        [domain: string]: DomainType,
      } = data['hmh-lists'] || {};

      chrome.contextMenus.update('blacklist', {
        checked: lists[domain] === DomainType.blacklist,
      });
      chrome.contextMenus.update('whitelist', {
        checked: lists[domain] === DomainType.whitelist,
      });
    }
  });
}