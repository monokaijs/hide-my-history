import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle, faKey, faLock, faWarning} from "@fortawesome/free-solid-svg-icons";
import {useAppDispatch, useAppSelector} from "~redux/store";
import {generateKeyPairEncrypted} from "~utils/encryption.utils";
import {setAuthData} from "~redux/slices/auth.slice";
import {useNavigate} from "react-router";
import {PasswordInput} from "~components/shared/Input";
import {useEffect, useState} from "react";
import {cn} from "~utils";

export default function SetupPasswordPage() {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const {encryptedPrivateKey} = useAppSelector(state => state.auth);
  const [message, setMessage] = useState({
    shown: false,
    isError: false,
    message: '',
  });
  const navigate = useNavigate();

  const finish = async (e: any) => {
    e.preventDefault();
    if (password.trim() === '') return setMessage({
      shown: true,
      isError: true,
      message: "Password is required.",
    });
    setDisabled(true);
    const keyPair = await generateKeyPairEncrypted(password);
    setMessage({
      shown: true,
      isError: false,
      message: "Master password created. Login to access features now!"
    });
    setTimeout(() => {
      dispatch(setAuthData({
        loggedIn: true,
        privateKey: keyPair.privateKey,
        encryptedPrivateKey: keyPair.encryptedPrivateKey,
        publicKey: keyPair.publicKey,
      }));
      navigate('/');
    }, 2000);
  }

  useEffect(() => {
    if (encryptedPrivateKey) navigate('/auth/login');
  }, [encryptedPrivateKey]);

  return <div className={'login'}>
    <form onSubmit={finish} className={'login-form'}>
      <FontAwesomeIcon icon={faKey} className={'figure-icon'}/>
      <div className={'form-content'}>
        <div className={'title'}>
          Hello
        </div>
        <div className={'description'}>
          You need to create a password to prevent unauthorized access and encrypt sensitive data.
        </div>
        {message.shown && (
          <div className={cn('message', message.isError ? 'error' : 'success')}>
            <div className={'icon'}>
              <FontAwesomeIcon icon={message.isError ? faWarning : faInfoCircle}/>
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
        <button typeof={'submit'} className={'btn-submit'} disabled={disabled}>
          Finish
        </button>
      </div>
    </form>
    <div className={'credit'}>
      Written by <a href={'https://delimister.com'} target={'_blank'}>@MonokaiJs</a>
    </div>
  </div>
}
