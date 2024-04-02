import "@/styles/home.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {useAppDispatch, useAppSelector} from "~redux/store";
import {setIncognitoMode} from "~redux/slices/app.slice";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const {incognitoMode} = useAppSelector(state => state.app);
  return <div className={'home'}>
    <div className={'widgets'}>
      <div className={'widget'}>
        <FontAwesomeIcon icon={faEyeSlash} className={'figure-icon'}/>
        <div className={'meta'}>
          <div className={'title'}>
            Incognito Mode
          </div>
          <div className={'description'}>
            Prevent recording history...
          </div>
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox" checked={incognitoMode} className="sr-only peer"
            onChange={() => {
              dispatch(setIncognitoMode(!incognitoMode));
            }}
          />
          <div
            className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"
          ></div>
        </label>
      </div>
      <div className={'widget'}>
        <FontAwesomeIcon icon={faClock} className={'figure-icon'}/>
        <div className={'meta'}>
          <div className={'title'}>
            Backup History
          </div>
          <div className={'description'}>
            Backup removed history...
          </div>
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox" className="sr-only peer"
            disabled
          />
          <div
            className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"
          ></div>
        </label>
      </div>
    </div>
  </div>
}
