import {useEffect, useState} from "react";
import historyService, {HistoryStoredItem} from "~services/HistoryService";
import {useAppSelector} from "~redux/store";
import {decryptDataWithPrivateKey} from "~utils/encryption.utils";
import dayjs from "dayjs";
import {getFavIcon} from "~utils";
import Input from "~components/shared/Input";
import {faEllipsisV, faLink, faRefresh, faSearch, faTag, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";

export default function HistoryPage() {
  const {privateKey} = useAppSelector(state => state.auth);
  const [entries, setEntries] = useState<HistoryStoredItem[]>([]);
  const [query, setQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<HistoryStoredItem[]>([]);

  const loadData = () => historyService.getStoredEntry().then(async data => {
    let parsedData = [];
    for (let item of data) {
      parsedData.push({
        ...item,
        title: await decryptDataWithPrivateKey(privateKey, item.title),
        url: await decryptDataWithPrivateKey(privateKey, item.url),
      });
    }
    setEntries(parsedData.sort((a, b) => {
      return b.time - a.time;
    }));
  });

  useEffect(() => {
    loadData().then(() => {
    });
  }, []);

  useEffect(() => {
    if (query.trim() === '') setFilteredEntries(entries);
    setFilteredEntries(entries => entries.filter(item => {
      return item.title.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query);
    }));
  }, [query, entries]);

  return <div className={'history'}>
    <div className={'control'}>
      <Input
        value={query}
        onValueChange={value => setQuery(value)}
        className={'input'}
        leftIcon={faSearch}
        placeholder={'Keyword...'}
      />
      <button className={'btn-control'} onClick={() => {
        historyService.clearStoredEntries().then(() => loadData());
      }}>
        <FontAwesomeIcon icon={faTrash}/>
      </button>
      <button className={'btn-control'} onClick={() => loadData()}>
        <FontAwesomeIcon icon={faRefresh}/>
      </button>
    </div>
    <div className={'items-list'}>
      {filteredEntries.map(record => (
        <div className={'history-item'} key={record.time}>
          <div className={'icon'}>
            <img
              src={getFavIcon(record.url)}
              alt={'favicon'}
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
              }}
            />
          </div>
          <div className={'title'} onClick={() => {
            return chrome.tabs.create({
              url: record.url,
            })
          }}>
            {record.title || record.url}
            {record.title && (
              <span style={{
                opacity: .4,
                fontWeight: 400,
                marginLeft: 4,
              }}>
              {new URL(record.url).host}
            </span>
            )}
          </div>
          <div className={'time'}>
            {dayjs(record.time).format('h:mm')}
          </div>
          <div className={'options'}>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className={'btn'}>
                  <FontAwesomeIcon icon={faEllipsisV}/>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={'dropdown-context-menu'}>
                <DropdownMenuItem onClick={() => chrome.tabs.create({
                  url: record.url
                })}>
                  <FontAwesomeIcon icon={faLink}/> Open link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  historyService.deleteEntry(record.time).then(() => loadData());
                }}>
                  <FontAwesomeIcon icon={faTrash}/> Remove Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  </div>
}
