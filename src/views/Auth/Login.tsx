import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faEye, faInfo, faKey, faLock, faWarning} from "@fortawesome/free-solid-svg-icons";
import {useAppDispatch, useAppSelector} from "~redux/store";
import {decryptWithPassword} from "~utils/encryption.utils";
import {setAuthData} from "~redux/slices/auth.slice";
import {useNavigate} from "react-router";
import {PasswordInput} from "~components/shared/Input";
import {useEffect, useState} from "react";
import {cn} from "~utils";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({
    shown: false,
    isError: false,
    message: '',
  });
  const {encryptedPrivateKey} = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const finish = async (e: any) => {
    e.preventDefault();
    try {
      const privateKey = await decryptWithPassword(encryptedPrivateKey, password);
      dispatch(setAuthData({
        loggedIn: true,
        privateKey,
      }));
      navigate('/');
    } catch (e) {
      setMessage({
        shown: true,
        isError: true,
        message: "Wrong password"
      });
    }
  }

  useEffect(() => {
    if (message.shown) setTimeout(() => {
      setMessage({
        ...message,
        shown: false,
      })
    }, 5000);
  }, [message.shown]);

  return <div className={'login'}>
    <form onSubmit={finish} className={'login-form'}>
      <div className={'form-content'}>
        <div className={'title'}>
          Login
        </div>
        <div className={'description'}>
          Enter password to manage your data.
        </div>
        {message.shown && (
          <div className={cn('message', message.isError ? 'error' : 'success')}>
            <div className={'icon'}>
              <FontAwesomeIcon icon={message.isError ? faWarning : faInfo}/>
            </div>
            {message.message}
          </div>
        )}
        <PasswordInput
          value={password}
          onValueChange={value => setPassword(value)}
          passwordToggle={true}
          leftIcon={faLock}
          placeholder={'Password...'}
        />
        <button typeof={'submit'} className={'btn-submit'}>
          Continue <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: 8}}/>
        </button>
      </div>
    </form>
    <div className={'credit'}>
      Written by <a href={'https://delimister.com'} target={'_blank'}>@MonokaiJs</a>
    </div>
  </div>
}
