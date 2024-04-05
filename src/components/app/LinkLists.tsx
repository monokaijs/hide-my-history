import {useEffect, useState} from "react";
import {deleteException, DomainType, updateExceptionList} from "~background/context-menu";
import unifiedStore from "~services/UnifiedStore";
import {cn} from "~utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faBox, faInfoCircle, faLink, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import Input from "~components/shared/Input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~components/ui/select";

interface LinkItem {
  [domain: string]: DomainType;
}

export default function LinkLists() {
  const [selectedType, setSelectedType] = useState<DomainType>(DomainType.whitelist);
  const [links, setLinks] = useState<LinkItem>(unifiedStore.rawData['hmh-lists']);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [showAddException, setShowAddException] = useState(false);
  const [creationType, setCreationType] = useState<DomainType>(DomainType.whitelist);
  const [url, setUrl] = useState('');

  useEffect(() => {
    unifiedStore.onUpdated.addListener(() => {
      setLinks(unifiedStore.rawData['hmh-lists']);
    })
  }, []);

  useEffect(() => {
    if (links) {
      const filtered = Object.keys(links).filter(key => {
        return links[key] === selectedType;
      });
      setFilteredLinks(filtered);
    }
  }, [links, selectedType]);

  const TabItem = ({title, value}: {title: string, value: DomainType}) => {
    return <div
      className={cn('px-2 py-2 cursor-pointer hover:border-b-2 hover:border-b-gray-400', selectedType === value ? 'border-b-2': '')}
      onClick={() => {
        setSelectedType(value);
      }}
    >
      {title}
    </div>
  }

  return <div className={'flex flex-col flex-1 border mx-3 rounded border-gray-100 mb-3'}>
    <div className={'flex flex-row bg-gray-100 px-1 items-center'}>
      <div className={'flex flex-row flex-1'}>
        <TabItem
          title={'Whitelist'}
          value={DomainType.whitelist}
        />
        <TabItem
          title={'Blacklist'}
          value={DomainType.blacklist}
        />
      </div>
      <div>
        <button className={'px-2 py-1'} onClick={() => {
          setCreationType(selectedType);
          setShowAddException(true);
        }}>
          <FontAwesomeIcon icon={faPlus}/> Add
        </button>
      </div>
    </div>
    <div className={'flex flex-col flex-1'}>
      {filteredLinks.map(item => {
        return <div
          key={item}
          className={'px-2 py-1 hover:bg-gray-100 cursor-pointer flex flex-row'}
        >
          <div className={'flex-1'}>
            {item}
          </div>
          <div>
            <button className={'text-gray-400 hover:text-gray-800'} onClick={() => {
              deleteException(item).then(() => {
                // Nothing
              });
            }}>
              <FontAwesomeIcon icon={faTrashCan}/>
            </button>
          </div>
        </div>
      })}
      {filteredLinks.length === 0 && (
        <div className={'flex-1 flex flex-col items-center justify-center text-gray-300'}>
          <FontAwesomeIcon icon={faBox} className={'text-4xl'}/>
          <div className={'mt-3'}>
            There's nothing here.
          </div>
          <button
            className={'border px-3 py-1 rounded mt-3 hover:bg-gray-200 hover:text-white'}
            onClick={() => {
              setCreationType(selectedType);
              setShowAddException(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus}/> Add
          </button>
        </div>
      )}
    </div>
    <div className={cn(showAddException ? 'flex' : 'hidden', 'fixed items-center justify-center left-0 right-0 top-0 bottom-0 z-40 bg-gray-900 bg-opacity-80')}>
      <div className={'bg-white p-3 rounded-xl'} style={{
        width: 500,
      }}>
        <div className={'text-lg font-bold'}>
          Add URL exception
        </div>
        <div>
          Add new url to exception list.
        </div>
        <div
          className={'bg-blue-200 p-2 rounded mt-3 flex flex-row'}
        >
          <div>
            <FontAwesomeIcon icon={faInfoCircle} className={'mr-2'}/>
          </div>
          <div className={'flex-1'}>
            {creationType === DomainType.whitelist ?
              "When a domain is in whitelist, history of the website will not be recorded by browser even with Incognito mode disabled.":
              "When a domain is in blacklist, history of the website will be recorded even Incognito mode enabled."}
          </div>
        </div>
        <div className={'mt-2 flex flex-row gap-2'}>
          <Input
            leftIcon={faLink}
            className={'flex-1'}
            placeholder={'https://example.com'}
            value={url}
            onValueChange={text => setUrl(text)}
          />
          <Select
            value={creationType.toString()}
            onValueChange={value => setCreationType(parseInt(value))}
          >
            <SelectTrigger className={'w-[120px]'}>
              <SelectValue placeholder="Whitelist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DomainType.blacklist.toString()}>Blacklist</SelectItem>
              <SelectItem value={DomainType.whitelist.toString()}>Whitelist</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={'mt-2 flex flex-row gap-2'}>
          <button className={'border py-2 flex-1 rounded'} onClick={() => setShowAddException(false)}>
            Cancel
          </button>
          <button
            className={'bg-gray-900 text-white py-2 flex-1 rounded'}
            onClick={() => {
              const domain = new URL(url);
              updateExceptionList(domain.hostname, creationType).then(() => {
                setShowAddException(false);
              }).catch(e => {
                console.log(e);
              });
            }}
          >
            Finish <FontAwesomeIcon icon={faArrowRight} className={'ml-1'}/>
          </button>
        </div>
      </div>
    </div>
  </div>
}
