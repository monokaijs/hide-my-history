import {useEffect, useState} from "react";
import historyService, {HistoryStoredItem} from "~services/HistoryService";
import {useAppSelector} from "~redux/store";
import {decryptDataWithPrivateKey} from "~utils/encryption.utils";
import dayjs from "dayjs";
import {getFavIcon} from "~utils";
import Input from "~components/shared/Input";
import {faRefresh, faSearch, faTag, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function HistoryPage() {
  const {privateKey} = useAppSelector(state => state.auth);
  const [entries, setEntries] = useState<HistoryStoredItem[]>([]);

  useEffect(() => {
    historyService.getStoredEntry().then(async data => {
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
  }, []);

  return <div className={'history'}>
    <div className={'control'}>
      <Input
        className={'input'}
        leftIcon={faSearch}
        placeholder={'Keyword...'}
      />
      <button className={'btn-control'}>
        <FontAwesomeIcon icon={faTrash}/>
      </button>
      <button className={'btn-control'}>
        <FontAwesomeIcon icon={faRefresh}/>
      </button>
    </div>
    <div className={'items-list'}>
      {entries.map(record => (
        <div className={'history-item'}>
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
          <div className={'title'}>
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
        </div>
      ))}
    </div>
  </div>
}
