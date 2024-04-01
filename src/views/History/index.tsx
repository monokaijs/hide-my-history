import {Table} from "antd";
import {useEffect, useState} from "react";
import historyService, {HistoryStoredItem} from "~services/HistoryService";
import {useAppSelector} from "~redux/store";
import {decryptDataWithPrivateKey} from "~utils/encryption.utils";
import dayjs from "dayjs";
import {getFavIcon} from "~utils";

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

  return <div>
    <Table
      dataSource={entries}
      rowKey={'time'}
      rowSelection={{}}
      pagination={{
        pageSize: 20,
        showTotal: (total) => {
          return 'Total ' + total + ' records';
        },
      }}
      columns={[{
        key: 'fav',
        width: 48,
        align: 'center',
        render: (value, record) => {
          return <img
            src={getFavIcon(record.url)}
            alt={'favicon'}
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
            }}
          />
        },
      }, {
        key: 'title',
        render: (value, record) => {
          return <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'row',
              gap: 16,
              fontWeight: 500,
            }}
            onClick={() => chrome.tabs.create({
              url: record.url,
            })}
          >
            {record.title || record.url}
            {record.title && (
              <div style={{
                opacity: .4,
                fontWeight: 400,
              }}>
                {new URL(record.url).host}
              </div>
            )}
          </div>
        }
      }, {
        key: 'time',
        dataIndex: 'time',
        title: 'Time',
        render: value => {
          return <>
            {dayjs(value).format('MMM D, YYYY h:mm A')}
          </>
        }
      }]}
    />
  </div>
}
