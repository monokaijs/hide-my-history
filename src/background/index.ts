import historyService from "~services/HistoryService";
import unifiedStore from "~services/UnifiedStore";
import {backgroundContextMenuStartup} from "~background/context-menu";
import {incognitoModeStartup} from "~background/incognito";

const startup = async () => {
  await historyService.register();
  await backgroundContextMenuStartup()
  await incognitoModeStartup();
  await unifiedStore.register();
}

startup().then(() => {
  console.log('Background startup successfully.');
});